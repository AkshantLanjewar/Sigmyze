const fs = require('fs')
const httpData = require('./http-data')

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

function TrimYear(year, data) {
    let nArray = []

    for(let i = 0; i < data.length; i++)  {
        let numDate = parseInt(data[i].date)
        if(numDate <= year)
            nArray.push(data[i])
    }

    return nArray
}

async function get_categories(req, res) {
    const categories_data = JSON.parse(fs.readFileSync('./data/metric-categories.json'))
    let keys = Object.keys(categories_data)
    return res.json(keys)
}

async function get_indicator_pair_payload(category_a, category_b) {
    const categories = JSON.parse(fs.readFileSync('./data/metric-categories.json'))

    let a_indicator = ShuffleArray(categories[category_a])[0]
    let b_indicator = ShuffleArray(categories[category_b])[0]
    while(a_indicator == b_indicator)
        b_indicator = ShuffleArray(categories[category_b])[0]

    const country_data = JSON.parse(fs.readFileSync('./data/countries.json'))
    let country        = country_data[Math.floor(Math.random() * country_data.length)]
    let indicator_a_data = await httpData.GrabIndicatorData(country["isoCode"], a_indicator)
    let indicator_b_data = await httpData.GrabIndicatorData(country["isoCode"], b_indicator)

    if(indicator_a_data.year > indicator_b_data.year)
        indicator_a_data.data = TrimYear(indicator_b_data.year, indicator_a_data.data)
    if(indicator_b_data.year > indicator_a_data.year)
        indicator_b_data.data = TrimYear(indicator_a_data.year, indicator_b_data.data)

    let payload = {country: country, data: [{name: a_indicator, data: indicator_a_data}, {name: b_indicator, data: indicator_b_data}]}
    if(indicator_a_data.data.length == 0 || indicator_b_data.data.length == 0)
        payload = await get_indicator_pair_payload(category_a, category_b)
    return payload
}

async function get_indicator_pair(req, res, retPayload = false) {
    const category_a = req.params.category_a
    const category_b = req.params.category_b
    res.json(await get_indicator_pair_payload(category_a, category_b))
}

async function sample_indicator(req, res) {
    //read file into disk
    const country_data = JSON.parse(fs.readFileSync('./data/countries.json'))
    const indicator_data = JSON.parse(fs.readFileSync('./data/indicators.json'))

    let country     = country_data[Math.floor(Math.random() * country_data.length)]
    let indicator_a = ShuffleArray(indicator_data)[0]
    let indicator_b = ShuffleArray(indicator_data)[0]
    
    let indicator_a_data = await httpData.GrabIndicatorData(country["isoCode"], indicator_a["shortName"])
    let indicator_b_data = await httpData.GrabIndicatorData(country["isoCode"], indicator_b["shortName"])

    if(indicator_b_data.year < indicator_a_data.year)
        indicator_a_data.data = TrimYear(indicator_b_data.year, indicator_a_data.data)
    else if(indicator_a_data.year > indicator_b_data.year)
        indicator_a_data.data = TrimYear(indicator_b_data.year, indicator_a_data.data)
    else if(indicator_b_data.year > indicator_a_data.year)
        indicator_b_data.data = TrimYear(indicator_a_data.year, indicator_b_data.data)

    let package = { country: country, indicators: [{ descriptor: indicator_a, data: indicator_a_data }, 
                                                   { descriptor: indicator_b, data: indicator_b_data }]}
    res.json(package)
}

exports.get_indicator_pair = get_indicator_pair
exports.sample_indicator = sample_indicator
exports.get_categories = get_categories