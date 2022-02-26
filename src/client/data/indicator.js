import { db } from './db'

async function AddIndicator(iso3, fullname, ind3, indicator, data) {
    db.indicators.put({
        iso3: iso3,
        fullname: fullname,
        ind3: ind3,
        units: indicator,
        data: data
    })
}

async function GetIndicator(iso3, ind3) {
    let data = await db.indicators.where({
        iso3: iso3,
        ind3: ind3
    }).toArray()

    return data
}

async function GetIndicatorDetails(iso3, ind3, dataset) {
    let data = await db.descriptions.where({
        iso3: iso3,
        ind3: ind3
    }).toArray()

    if(data.length == 0) {
        let url  = `/api/data/v2/datasets/${dataset}/definitions/${ind3}`
        let rep  = await ( await fetch(url) ).json()
        let data = rep.data

        console.log(data)
    } else
        return data[0]
}

async function GetIndicatorV(iso3, ind3, dataset) {
    let data = await db.indicators.where({
        iso3: iso3,
        ind3: ind3
    }).toArray()

    if(data.length == 0) {
        let url = `/api/data/v2/datasets/${dataset}/${iso3}/${ind3}`
        let rep = await (await fetch(url)).json()
        let data = rep.data

        let obj = {
            iso3: iso3,
            fullname: rep['sName'],
            ind3: ind3,
            units: rep['units'],
            data: data
        }

        db.indicators.put(obj)
        return obj 
    } else
        return data[0]
}

export { AddIndicator, GetIndicator, GetIndicatorV, GetIndicatorDetails }