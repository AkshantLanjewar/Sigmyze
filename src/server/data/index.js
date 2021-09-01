const Router   = require('express').Router
const schedule = require('node-schedule') 

const httpData  = require('./http-data')
const indicator = require('./indicator')
const map       = require('./map')

function DataRouter() {
    //set the cron task
    schedule.scheduleJob('0 0 * * *', httpData.IndexData)
    httpData.IndexData()

    const router = Router()
    router.get('/map/gdp_growth', map.gdpGrowthGlobalMAP)

    router.get('/indicator/categories', indicator.get_categories)
    router.get('/indicator/categories/pair/:category_a/:category_b', indicator.get_indicator_pair)
    router.get('/sample_indicator', indicator.sample_indicator)

    return router
}

exports.dataRouter = DataRouter