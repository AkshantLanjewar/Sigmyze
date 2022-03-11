import CreateDB from './db'

async function GetIndicatorV(iso3, ind3, dataset) {
    let db  = await CreateDB()
    let key = `${iso3}${ind3}`
    let res = await db.get('indicator_v', key) 

    if(res == undefined) {
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

        await db.put('indicator_v', obj, key)
        return obj 
    } else
        return res
}

async function GetDatasetIndicators(dataset, iso3) {
    let db  = await CreateDB()
    let key = `${dataset}${iso3}`
    let res = await db.get('country_indicators', key)

    if(res == undefined) {
        let catUrl  = `/api/data/v2/datasets/${dataset}/categories`
        let catRep  = await ( await fetch(catUrl) ).json()
        let catData = catRep.data

        let indicator_list = []
        
        for(let i = 0; i < catData.length; i++) {
            let category = catData[i].replace(dataset, '')
            let subUrl   = `/api/data/v2/datasets/${dataset}/categories/${category}/${iso3}`
            let subRep   = await ( await fetch(subUrl) ).json()
            let subData  = subRep.indicators

            for(let i = 0; i < subData.length; i++) {
                let indicator = subData[i]
                indicator['category'] = category.replace(dataset, '')
                indicator_list.push(indicator) 
            }
        }

        let obj = {
            dataset: dataset,
            iso3: iso3,
            indicators: indicator_list
        }

        await db.put('country_indicators', obj, key)
        return obj
    } else
        return res
}

export { 
    GetIndicatorV, 
    GetDatasetIndicators 
}