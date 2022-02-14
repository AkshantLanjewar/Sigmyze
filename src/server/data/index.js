const Router   = require('express').Router
const schedule = require('node-schedule') 

const httpData  = require('./v1/http-data')
const indicator = require('./v1/indicator')
const map       = require('./v1/map')

const v2 = require('./v2/index')
const WEOTab = require('./scraper/weo.js')
const COVIDTab = require('./scraper/covid')

function DataRouter() {
    //set the cron task
    schedule.scheduleJob('0 0 * * *', httpData.IndexData)
    schedule.scheduleJob('0 0 * * *', WEOTab.TabulateWEOData)
    schedule.scheduleJob('0 0 * * *', COVIDTab.TabulateCovidData)

    httpData.IndexData()
    WEOTab.TabulateWEOData()
    COVIDTab.TabulateCovidData()

    const router = Router()
    router.get('/map/gdp_growth', map.gdpGrowthGlobalMAP)
    router.get('/categories/:category', indicator.get_category)

    router.get('/countries', indicator.get_countries)
    router.get('/indicator/:iso3/:category', indicator.get_indicator)
    router.get('/indicator/categories/pair/:category_a/:category_b', indicator.get_indicator_pair)

    router.use('/v2', v2.V2APIRouter())

    return router
}

exports.dataRouter = DataRouter