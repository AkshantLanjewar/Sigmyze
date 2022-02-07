/// function to tab through the weo data and organize it in a meaningful manner
const fs = require('fs')
const http = require('http')

//const API_ROOT = "http://34.70.145.116:8080"
const API_ROOT = "http://34.66.146.203:8080"
//const API_ROOT = 'http://127.0.0.1'
const dataset = 'COVID'
const datatype = 'covid' // This is for backend API segregration - e.g. /api/econdata/, /api/covid/

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

async function TabulateCovidData() {
    //check if folder exists
    if(!fs.existsSync('./indicatorDB'))
        fs.mkdirSync('indicatorDB')
    if(!fs.existsSync('./indicatorDB/'+ dataset))
        fs.mkdirSync('indicatorDB/'+ dataset)
    if(!fs.existsSync('./indicatorDB/'+dataset+'/groups'))
        fs.mkdirSync('indicatorDB/'+dataset+'/groups')
    if(!fs.existsSync('./indicatorDB/'+dataset+'/countries'))
        fs.mkdirSync('indicatorDB/'+dataset+'/countries')


    let combined_indicators = []

    //start with categories
    let categories_rep = ['COVIDCovid']
    //let categories_url = "/api/econdata/metricgroups/"
    //let categories_req = HTTP_GET(categories_url).catch((error) => {console.error(error)})
    //let categories_rep = JSON.parse(await categories_req)

    //save the file
    fs.writeFileSync(`./indicatorDB/${dataset}/categories.json`, JSON.stringify(categories_rep))

    //let combined_indicators = []

    for(let i = 0; i < categories_rep.length; i++) {
        let category = categories_rep[i]
        let url = `/api/${datatype}/getMetrics/`
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

        fs.writeFileSync(`./indicatorDB/${dataset}/groups/${category}_indicators.json`, JSON.stringify(fin_rep))
    }

    let url = `/api/${datatype}/getMetrics/`
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

    fs.writeFileSync(`./indicatorDB/${dataset}/tot_indicators.json`, JSON.stringify(combined_indicators))

    let country_url = '/api/econdata/countries/' //country list is available only in /api/econdata.
    //Hence /api/econdata not replaced by /api/${datatype}

    let country_req = HTTP_GET(country_url).catch((error) => {console.error(error)})
    let country_rep = JSON.parse(await country_req)

    //fs.writeFileSync(`./indicatorDB/countries.json`, JSON.stringify(country_rep))

    for(let i = 0; i < country_rep.length; i++) {
        let country = country_rep[i]
        let iso3 = country['iso3']
        let active_indicators = []

        for(let x = 0; x < combined_indicators.length; x++) {
            let indicator = combined_indicators[x]
            let shortI = indicator['indicator']

            let url = `/api/${datatype}/getMetricDataC/${shortI}/${iso3}/`
            let req = HTTP_GET(url).catch((error) => { console.log(error) })
            let rep = JSON.parse(await req)

            let rep_data = rep['data']
            //convert data to array
            let data_keys = Object.keys(rep_data)
            let data = []
            for(let y = 0; y < data_keys.length; y++) {
                let date  = data_keys[y]
                let value = rep_data[date]
                data.push({ date: date, value: value })
            }

            if(data[0] == null)
                continue
            active_indicators.push(indicator)
        }

        fs.writeFileSync(`./indicatorDB/${dataset}/countries/${iso3}_active.json`, JSON.stringify(active_indicators))
    }
}

exports.TabulateCovidData = TabulateCovidData
