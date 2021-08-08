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
        if(!fs.existsSync('./data'))
            fs.mkdirSync('./data')
        let string_nation = JSON.stringify(nation_list)
        fs.writeFileSync('./data/countries.json', string_nation)
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

async function GrabIndicatorData(isoCode, indicatorCode) {
    let year = 0000

    let url = `api/econdata/getMetricDataC/${indicatorCode}/${isoCode}/`
    let promise = HTTP_Promise(url)
    let result = JSON.parse(await promise)

    let keys = Object.keys(result["data"])
    let data = []
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let keyNum = parseInt(key)
        let d_val = result["data"][key]

        if(d_val == null)
            continue
        if(year == 0)
            year = keyNum

        data.push({ date: key, value: d_val })
    }

    return { year: year, data: data }
}

function TrimYear(year, data) {
    let nArray = []

    for(let i = 0; i < data.length; i++)  {
        let numDate = parseInt(data[i].date)

        if(numDate < year)
            continue
        nArray.push(data[i])
    }

    return nArray
}

function DataRouter() {
    //set the cron task
    schedule.scheduleJob('0 0 * * *', IndexData)
    IndexData()

    const router = Router()

    router.get('/map/gdp_growth', async (req, res) => {
        const countrygeoJSON = JSON.parse(fs.readFileSync('./data/countries.geo.json'))

        //edit the features
        let features = countrygeoJSON["features"]
    })

    router.get('/sample_indicator', async (req, res) => {
        //read file into disk
        const country_data = JSON.parse(fs.readFileSync('./data/countries.json'))
        const indicator_data = JSON.parse(fs.readFileSync('./data/indicators.json'))

        let country     = country_data[Math.floor(Math.random() * country_data.length)]
        let indicator_a = ShuffleArray(indicator_data)[0]
        let indicator_b = ShuffleArray(indicator_data)[0]
        
        let indicator_a_data = await GrabIndicatorData(country["isoCode"], indicator_a["shortName"])
        let indicator_b_data = await GrabIndicatorData(country["isoCode"], indicator_b["shortName"])

        if(indicator_a_data.year > indicator_b_data.year)
            indicator_b_data.data = TrimYear(indicator_a_data.year, indicator_b_data.data)
        if(indicator_b_data.year > indicator_a_data.year)
            indicator_a_data.data = TrimYear(indicator_b_data.year, indicator_a_data.data)

        let package = { country: country, indicators: [{ descriptor: indicator_a, data: indicator_a_data }, 
                                                       { descriptor: indicator_b, data: indicator_b_data }]}
        res.json(package)
    })

    return router
}

exports.dataRouter = DataRouter