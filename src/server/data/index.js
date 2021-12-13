const Router   = require('express').Router
const schedule = require('node-schedule') 

const httpData  = require('./v1/http-data')
const indicator = require('./v1/indicator')
const map       = require('./v1/map')

const WEOTab = require('./weo/index')

function DataRouter() {
    //set the cron task
    schedule.scheduleJob('0 0 * * *', httpData.IndexData)
    schedule.scheduleJob('0 0 * * *', WEOTab.TabulateWEOData)

    httpData.IndexData()
    WEOTab.TabulateWEOData()

    const router = Router()
    router.get('/map/gdp_growth', map.gdpGrowthGlobalMAP)
    router.get('/categories/:category', indicator.get_category)

    router.get('/countries', indicator.get_countries)
    router.get('/indicator/:iso3/:category', indicator.get_indicator)
    router.get('/indicator/categories/pair/:category_a/:category_b', indicator.get_indicator_pair)

    return router
}

exports.dataRouter = DataRouter