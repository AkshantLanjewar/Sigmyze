const http = require('http')
const fs = require('fs')

const API_ROOT = "http://34.70.145.116:8080"

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

async function IndexData() {
    try {
        let econ_http_promise  = HTTP_Promise("api/econdata/getGDPGrowthGlobal/").catch((error) => {console.error(error)})
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

async function GrabIndicatorData(isoCode, indicatorCode) {
    let year = 0000

    let url = `api/econdata/getMetricDataC/${indicatorCode}/${isoCode}/`
    let promise = HTTP_Promise(url).catch((error) => {console.error(error)})
    let result = JSON.parse(await promise.catch(() => {}))

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

exports.HTTP_Promise = HTTP_Promise
exports.IndexData = IndexData
exports.GrabIndicatorData = GrabIndicatorData