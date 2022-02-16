const http = require('http')

function ContainsIndicator(indicator, list) {
    for (let i = 0; i < list.length; i++) {
        let indicator_t = list[i]
        if (indicator_t.indicator == indicator.indicator)
            return true
    }

    return false
}

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
    }).catch((error) => { console.error(error) })
}

exports.ContainsIndicator = ContainsIndicator
exports.HTTP_Promise      = HTTP_Promise