const Router   = require('express').Router
const schedule = require('node-schedule') 
const http = require('http')
const fs = require('fs')

const API_ROOT = "http://34.70.145.116"

function HTTP_Promise(sublet) {
    return new Promise((resolve, reject) => {
        http.get(API_ROOT + '/' + sublet, (response) => {
            let data_chunks = []

            response.on('data', (fragments) => {
                data_chunks.push(fragments)
            })

            response.on('end', () => {
                let response_body = Buffer.concat(data_chunks)
                resolve(response_body.toString())
            })

            response.on('error', (error) => {
                reject(error)
            })
        })
    })
}

async function IndexData() {
    try {
        let econ_http_promise  = HTTP_Promise("api/econdata/getGDPGrowthGlobal/")
        let econ_http_response = JSON.parse(await econ_http_promise)

        let nation_list = []

        for(let i = 0; i < econ_http_response.length; i++) {
            let country = econ_http_response[i]
            nation_list.push({ isoCode: country["iso3"], fullname: country["country"] })
        }

        //save to disk
        let string_nation = JSON.stringify(nation_list)

        if(!fs.existsSync('./data'))
            fs.mkdirSync('./data')

        let categories_http_promise  = HTTP_Promise("api/econdata/getWEOMetricList/")
        let categories_http_response = JSON.parse(await categories_http_promise)
        
        let categories_list = []
        let categories_keys = Object.keys(categories_http_response)
        for(let i = 0; i < categories_keys.length; i++)
            categories_list.push({ shortName: categories_keys[i], fullname: categories_http_response[categories_keys[i]] })
        
        fs.writeFileSync('./data/countries.json', string_nation)
        fs.writeFileSync('./data/indicators.json', JSON.stringify(categories_list))
    } catch(error) {
        console.error(error)
    }
}

function ShuffleArray(array) {
    let currentIndex = array.length, randomIndex

    while(0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
}

function GrabIndicatorData(isoCode, indicatorCode) {

}

function DataRouter() {
    //set the cron task
    schedule.scheduleJob('0 0 * * *', IndexData)
    IndexData()

    const router = Router()

    router.get('/sample_indicator', async (req, res) => {
        //read file into disk
        const country_data = JSON.parse(fs.readFileSync('./data/countries.json'))
        const indicator_data = JSON.parse(fs.readFileSync('./data/indicators.json'))

        let country     = country_data[Math.floor(Math.random() * country_data.length)]
        let indicator_a = ShuffleArray(indicator_data)[0]
        let indicator_b = ShuffleArray(indicator_data)[0]

        let m_year  = 0000
        let mb_year = 0000

        //grab indicator_a data
        let indicator_a_url = `api/econdata/getMetricDataC/${indicator_a["shortName"]}/${country["isoCode"]}/`
        let indicator_a_promise  = HTTP_Promise(indicator_a_url)
        let indicator_a_result   = JSON.parse(await indicator_a_promise)

        let indicator_a_data_keys =  Object.keys(indicator_a_result["data"])
        let indicator_a_data      = []
        for(let i = 0; i < indicator_a_data_keys.length; i++) {
            let key  = indicator_a_data_keys[i]
            let keyNum = parseInt(key)
            let data = indicator_a_result["data"][key] 

            if(data == null)
                continue
            if(m_year == 0 )
                m_year = keyNum
            
            indicator_a_data.push({ date: key, value: data })
        }

        
        let indicator_a_data = GrabIndicatorData(country["isoCode"], indicator_a["shortName"])
        let indicator_b_data = GrabIndicatorData(country["isoCode"], indicator_b["shortName"])

        let package = { country: country, indicators: [indicator_a, indicator_b] }
        res.json(package)
    })

    return router
}

exports.dataRouter = DataRouter