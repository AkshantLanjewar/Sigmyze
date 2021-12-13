const httpData = require('./http-data')
const fs = require('fs')

async function gdpGrowthGlobalMAP(req, res) {
    const countrygeoJSON = JSON.parse(fs.readFileSync('./data/countries.geo.json'))

    let request = httpData.HTTP_Promise("api/econdata/getGDPGrowthGlobal/")
    let data    = JSON.parse(await request)
    let country_data = {}

    for(let x = 0; x < data.length; x++) {
        let country = data[x]
        let years   = Object.keys(country["growthAnnual"])
        //get the last year
        let lastYear = years[years.length - 1]
        let growth = country["growthAnnual"][lastYear]
        country_data[country["iso3"]] = growth
    }

    //edit the features
    let features = countrygeoJSON["features"]

    let minGrowth = 0
    let maxGrowth = 0

    //loop through the features
    for(let i = 0; i < features.length; i++) {
        let feature = features[i]

        let id     = feature['id']
        let growth = country_data[id]

        if(growth > maxGrowth)
            maxGrowth = growth
        if(growth < minGrowth)
            minGrowth = growth

        //alter the features
        feature["properties"]["growth"] = growth
        features[i] = feature
    }

    countrygeoJSON["features"] = features
    res.json({ geo: countrygeoJSON, maxGrowth: maxGrowth, minGrowth: minGrowth })
}

exports.gdpGrowthGlobalMAP = gdpGrowthGlobalMAP