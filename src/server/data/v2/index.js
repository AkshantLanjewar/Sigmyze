const Router = require('express').Router
const fs = require('fs')

function ContainsIndicator(indicator, list) {
    for(let i = 0; i < list.length; i++) {
        let indicator_t = list[i]
        if(indicator_t.indicator == indicator.indicator)
            return true
    }

    return false
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