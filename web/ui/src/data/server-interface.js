import CreateDB from "./backend/db"

function HandleError(status) {

}

async function GetDatasets() {
    let db  = await CreateDB()
    let key = 'datasets_v2'
    let res = await db.get('ds_datasets', key)
    
    if(res == undefined) {
        let url = '/api/v1/datasets'
        let rep = await (await fetch(url)).json()
        
        let status = rep['status']
        let data   = rep['datasets']
        if(status.error == false) {
            const obj = {
                datasets: data
            }

            await db.put('ds_datasets', obj, key)
            return obj
        } else
            return null
    } else
        return res
}

async function GetCategories(dataset) {

}

async function GetObjects(dataset) {
    let db  = await CreateDB()
    let key = dataset.toUpperCase()
    let res = await db.get('ds_objects', key) 

    if(res == undefined) {
        let url = `/api/v2/datasets/${dataset}/objects`
        let rep = await (await fetch(url)).json()

        let status = rep['status']
        let objects = rep['objects']
        if(status.error == false) {
            const obj = {
                objects: objects
            }

            await db.put('ds_objects', obj, key)
            return obj
        } else {
            HandleError(status)
            return null
        }
    } else
        return res
}

async function GetIndicators(dataset, object_id) {
    let db  = await CreateDB()
    let key = `${dataset}_${object_id}`
    let res = await db.get('ds_indicators', key)

    if(res == undefined) {
        let url = `/api/v2/datasets/${dataset}/objects/${object_id}/indicators`
        let rep = await (await fetch(url)).json()

        let status     = rep['status']
        let indicators = rep['indicators']

        if(status.error == false) {
            const obj = {
                indicators: indicators
            }

            await db.put('ds_indicators', obj, key)
            return obj
        } else {
            HandleError(status)
            return null
        }
    } else
        return res
}

async function GetIndicator(dataset, object_id, indicator_id) {
    let db  = await CreateDB()
    let key = `${dataset}_${object_id}_${indicator_id}`
    let res = await db.get('ds_indicator', key)

    if(res == undefined) {
        let url = `/api/v2/datasets/${dataset}/objects/${object_id}/indicators/${indicator_id}`
        let rep = await (await fetch(url)).json()

        let status = rep['status']
        let data   = rep['indicator']

        if(status.error == false) {
            const obj = data

            await db.put('ds_indicator', obj, key)
            return obj
        } else {
            HandleError(status)
            return null
        }
    } else 
        return res
}

export {
    GetDatasets,
    GetCategories,
    GetObjects,
    GetIndicators,
    GetIndicator
}