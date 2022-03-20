/// function to tab through the weo data and organize it in a meaningful manner
const fs = require('fs')
const http = require('http')

//const API_ROOT = "http://34.70.145.116:8080"
//const API_ROOT = "http://34.66.146.203:8080"
const API_ROOT = 'http://127.0.0.1'
const dataset = 'WEO'
const datatype = 'econdata' // This is for backend API segregration - e.g. /api/econdata/, /api/covid/

function HTTP_GET(sublet) {
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

async function TabulateWEOMapData() {
    //check if folder exists
    if(!fs.existsSync('./indicatorDB'))
        fs.mkdirSync('indicatorDB')
    if(!fs.existsSync('./indicatorDB/'+ dataset))
        fs.mkdirSync('indicatorDB/'+ dataset)
    if(!fs.existsSync('./indicatorDB/'+dataset+'/maps'))
        fs.mkdirSync('indicatorDB/'+dataset+'/maps')
    if(!fs.existsSync('./indicatorDB/'+dataset+'/maps/indicators'))
        fs.mkdirSync('indicatorDB/'+dataset+'/maps/indicators')
    if(!fs.existsSync('./indicatorDB/'+dataset+'/maps/timeframe'))
        fs.mkdirSync('indicatorDB/'+dataset+'/maps/timeframe')


    let combined_indicators = []

    //start with categories
    let categories_rep = []

    let fileLocation = `./indicatorDB/${dataset}/categories.json`
    if(!fs.existsSync(fileLocation))
        return res.send("category_404")

    let categoryJSON = JSON.parse(fs.readFileSync(fileLocation))

    for(let i = 0; i < categoryJSON.length; i++) {
        let cat = categoryJSON[i]
        categories_rep.push(cat)
    }


    for(let i = 0; i < categories_rep.length; i++) {
        let category = categories_rep[i]
        let url = `/api/${datatype}/getMapData/${category}/getMetrics/`
        let req = HTTP_GET(url).catch((error) => { console.log(error) })

        let rep = JSON.parse(await req)
        let rep_keys = Object.keys(rep)
        let fin_rep = []

        for(let x = 0; x < rep_keys.length; x++) {
            let package = {}
            package['indicator'] = rep_keys[x]
            package['name'] = rep[rep_keys[x]]
            fin_rep.push(package)
            //combined_indicators.push(package)
        }

        fs.writeFileSync(`./indicatorDB/${dataset}/maps/indicators/${category}_indicators.json`, JSON.stringify(fin_rep))
    }

    for(let i = 0; i < categories_rep.length; i++) {
      let category = categories_rep[i]
      let url = `/api/${datatype}/getMapData/${category}/getMetrics/`
      let req = HTTP_GET(url).catch((error) => { console.log(error) })

      let resp = JSON.parse(await req)
      let resp_keys = Object.keys(resp)
      let fin_resp = []

      for(let x = 0; x < resp_keys.length; x++) {
          let package = {}
          package['indicator'] = resp_keys[x]
          package['name'] = resp[resp_keys[x]]
          //fin_resp.push(package)
          combined_indicators.push(package)
      }

      fs.writeFileSync(`./indicatorDB/${dataset}/maps/tot_indicators.json`, JSON.stringify(combined_indicators))

    }



    let yrs = []
    let startYr = 1980
    let endYr = new Date().getFullYear()

    for (i=startYr; i<=endYr; i++){
      yrs.push(i)
    }

    let mnths = []
    let timeframe = {'years': yrs, 'months': mnths}

    fs.writeFileSync(`./indicatorDB/${dataset}/maps/timeframe/timeframe.json`, JSON.stringify(timeframe))
}

exports.TabulateWEOMapData = TabulateWEOMapData
