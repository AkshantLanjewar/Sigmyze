const Router = require('express').Router
const fs = require('fs')
const http = require('http')

function ContainsIndicator(indicator, list) {
    for(let i = 0; i < list.length; i++) {
        let indicator_t = list[i]
        if(indicator_t.indicator == indicator.indicator)
            return true
    }

    return false
}

//const API_ROOT = "http://34.70.145.116:8080"
const API_ROOT = "http://34.66.146.203:8080"

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
    }).catch((error) => {console.error(error)})
}

function V2APIRouter() {
    const router = Router()
    const datasets = [ {name: 'WEO', type: 'economic'} ]

    router.get('/', (req, res) => {
        return res.send("working")
    })

    router.get('/datasets', (req, res) => {
        return res.json(datasets)
    })

    router.get('/datasets/:dataset/categories/', (req, res) => {
        let dataset = req.params.dataset
        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")

        let filepath = `./indicatorDB/${dataset}/categories.json`
        let json = JSON.parse(fs.readFileSync(filepath))

        return res.json(json)
    })

    router.get('/datasets/:dataset/:iso3/:indicator', async (req, res) => {
        let dataset = req.params.dataset
        let iso3 = req.params.iso3
        let indicator = req.params.indicator

        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")
        let countryLocation = `./indicatorDB/${dataset}/countries/${iso3}_active.json`
        if(!fs.existsSync(countryLocation))
            return res.send("country_404")

        let countryIndicators = JSON.parse(fs.readFileSync(countryLocation))
        let indicatorFound = false
        for(let i = 0; i < countryIndicators.length; i++) {
            let indicatorObj = countryIndicators[i]
            if(indicatorObj.indicator == indicator)
                indicatorFound = true
        }

        if(!indicatorFound)
            return res.send("indicatr_404")

        let url = `api/econdata/getMetricDataC/${indicator}/${iso3}/`
        let promise = HTTP_Promise(url).catch((error) => { console.error(error) })
        let result = JSON.parse(await promise)

        let keys = Object.keys(result["data"])
        let simpleName = result['simpleName']
        let scale = result['scale']

        if (scale == '(empty)'){
          scale = "%";
        }


        let data = []
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let keyNum = parseInt(key)
            let d_val = result["data"][key]

            if(d_val == null)
                continue
            data.push({ date: key, value: d_val })
        }

        return res.json({data:data, sName:simpleName, scale:scale})
    })

    router.get('/datasets/:dataset/categories/:category/:iso3', (req, res) => {
        let category = req.params.category
        let dataset = req.params.dataset
        let iso3 = req.params.iso3.toUpperCase()

        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")
        let fileLocation = `./indicatorDB/${dataset}/groups/${dataset}${category}_indicators.json`
        if(!fs.existsSync(fileLocation))
            return res.send("category_404")
        let countryFileLocation = `./indicatorDB/${dataset}/countries/${iso3}_active.json`
        if(!fs.existsSync(countryFileLocation))
            return res.send("country_404")

        let categoryJSON = JSON.parse(fs.readFileSync(fileLocation))
        let countryJSON = JSON.parse(fs.readFileSync(countryFileLocation))

        let indicators = []
        for(let i = 0; i < categoryJSON.length; i++) {
            let indicator = categoryJSON[i]
            if(ContainsIndicator(indicator, countryJSON))
                indicators.push(indicator)
        }

        return res.json(indicators)
    })

    return router
}

exports.V2APIRouter = V2APIRouter
