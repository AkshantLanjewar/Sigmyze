const Router   = require('express').Router
const schedule = require('node-schedule')

const httpData  = require('./v1/http-data')
const indicator = require('./v1/indicator')
const map       = require('./v1/map')

const v2 = require('./v2/index')
const v2map = require('./v2/v2map')

const WEOTab = require('./weo/index')
const WEOMapTab = require('./weo/map')
const COVIDTab = require('./covid/index')
//const COVIDMapTab = require('./covid/map')

function DataRouter() {
    //set the cron task
    schedule.scheduleJob('0 0 * * *', httpData.IndexData)
    schedule.scheduleJob('0 0 * * *', WEOTab.TabulateWEOData)
    schedule.scheduleJob('0 0 * * *', WEOMapTab.TabulateWEOMapData)
    schedule.scheduleJob('0 0 * * *', COVIDTab.TabulateCovidData)
    //schedule.scheduleJob('0 0 * * *', COVIDMapTab.TabulateCovidMapData)

    httpData.IndexData()
    WEOTab.TabulateWEOData()
    WEOMapTab.TabulateWEOMapData()
    COVIDTab.TabulateCovidData()
    //COVIDMapTab.TabulateCovidMapData()

    const router = Router()
    router.get('/map/gdp_growth', map.gdpGrowthGlobalMAP)
    router.get('/categories/:category', indicator.get_category)

    router.get('/countries', indicator.get_countries)
    router.get('/indicator/:iso3/:category', indicator.get_indicator)
    router.get('/indicator/categories/pair/:category_a/:category_b', indicator.get_indicator_pair)

    router.use('/v2', v2.V2APIRouter())
    router.use('/v2map', v2map.V2MAPAPIRouter())

    return router
}

exports.dataRouter = DataRouter
