const Router = require('express').Router
const fs = require('fs')
const http = require('http')

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

function V2MAPAPIRouter() {
    const router = Router()
    const datasets = [
      {name: 'WEO', type: 'econdata'},
      {name: 'COVID', type: 'covid'}
    ]

    const countrygeoJSON = JSON.parse(fs.readFileSync('./data/country_50m_subunits.geo.json'))

    router.get('/', (req, res) => {
        return res.send("working")
    })

    router.get('/datasets', (req, res) => {
        return res.json(datasets)
    })


    router.get('/datasets/:dataset/categories/:category', (req, res) => {
        let category = req.params.category
        let dataset = req.params.dataset

        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")
        let fileLocation = `./indicatorDB/${dataset}/maps/indicators/${dataset}${category}_indicators.json`
        if(!fs.existsSync(fileLocation))
            return res.send("category_404")


        let categoryJSON = JSON.parse(fs.readFileSync(fileLocation))

        let indicators = []
        for(let i = 0; i < categoryJSON.length; i++) {
            let indicator = categoryJSON[i]
            indicators.push(indicator)
        }

        return res.json(indicators)
    })



    router.get('/datasets/:dataset/timeframe', (req, res) => {
        let dataset = req.params.dataset

        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")

        let fileLocation = `./indicatorDB/${dataset}/maps/timeframe/timeframe.json`
        if(!fs.existsSync(fileLocation))
            return res.send("timeframe_404")

        let tfJSON = JSON.parse(fs.readFileSync(fileLocation))

        return res.json(tfJSON)
    })

    router.get('/datasets/:dataset/:indicator/:year/:month', async (req, res) => {
        let dataset = req.params.dataset
        let indicator = req.params.indicator
        let year = req.params.year
        let month = req.params.month

        if(!year){
          return res.send("timeframe_404")
        }

        if(!month){month=0}

        let datatype = ""

        for (let i=0; i<datasets.length; i++){
          if (datasets[i]['name']==dataset){
            datatype=datasets[i]['type']
          }
        }

        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")


        let url = `api/${datatype}/getMapData/${indicator}/${year}/${month}/`
        let promise = HTTP_Promise(url).catch((error) => { console.error(error) })
        let result = JSON.parse(await promise)

        let data = result["data"]
        let min1 = result['min1']
        let min2 = result['min2']
        let max1 = result['max1']
        let max2 = result['max2']
        let minG = result['minG']
        let maxG = result['maxG']

        const countryGeoJSON = JSON.parse(fs.readFileSync('./data/country_50m_subunits.geo.json'))

        let features = countryGeoJSON['features']

        for (let i=0;i<features.length;i++){
          let feature = features[i]

          let iso3 = feature["properties"]["ISO_A3_EH"]

          let metric = data[iso3]
          feature["properties"]["metric"] = metric
          features[i] = feature
        }

        countryGeoJSON["features"] = features


        return res.json({min1:min1, min2:min2, max1:max1, max2:max2, minG:minG, maxG:maxG, geo:countryGeoJSON})
    })

    router.get('/datasets/:dataset/topC/:indicator/:year/:month', async (req, res) => {
        let dataset = req.params.dataset
        let indicator = req.params.indicator
        let year = req.params.year
        let month = req.params.month

        if(!year){
          return res.send("timeframe_404")
        }

        if(!month){month=0}

        let datatype = ""

        for (let i=0; i<datasets.length; i++){
          if (datasets[i]['name']==dataset){
            datatype=datasets[i]['type']
          }
        }

        let folderLocation = `./indicatorDB/${dataset}`
        if(!fs.existsSync(folderLocation))
            return res.send("dataset_404")


        let url = `api/${datatype}/getMapData/${indicator}/${year}/${month}/`
        let urlC = `api/econdata/countries/`

        let promise = HTTP_Promise(url).catch((error) => { console.error(error) })
        let result = JSON.parse(await promise)

        let promiseC = HTTP_Promise(urlC).catch((error) => { console.error(error) })
        let resultC = JSON.parse(await promiseC)

        let data = result["data"]
        let dataC = resultC

        dataEntries = Object.entries(data)

        dataEntries.sort((a,b) => b[1]-a[1])

        let retData = []

        for(let i=0;i<dataEntries.length;i++){
          let obj = {}
          let name = ''
          obj['iso3'] = dataEntries[i][0]

          for(let j=0;j<dataC.length;j++){
            if (dataC[j]['iso3']== dataEntries[i][0]){
              name = dataC[j]['name']
            }
          }
          obj['name'] = name
          obj['value']= dataEntries[i][1]

          retData.push(obj)

        }

        return res.json(retData)
    })


    return router
}

exports.V2MAPAPIRouter = V2MAPAPIRouter
