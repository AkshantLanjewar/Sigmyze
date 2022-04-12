import CreateDB from "./db";

async function GetDatasets() {
    let db  = await CreateDB()
    let key = 'datasets'
    let res = await db.get('ds_datasets', key)
    
    if(res == undefined) {
        let url = `/api/v1/datasets/`
        let rep = await (await fetch(url)).json()
        
        let status = rep['status']
        if(status.error == false) {
            const datasets = rep['datasets']
            const object   = {
                datasets: datasets
            }

            await db.put('ds_datasets', object, key)
            return object
        }
    } else {
        return res
    }
}

async function GetCategories(dataset) {
    let db  = await CreateDB()
    let key = dataset.toLowerCase()
    let res = await db.get('ds_categories', key)

    if(res == undefined) {
        let url = `/api/v1/datasets/${key}/categories`
        let rep = await (await fetch(url)).json()

        let status = rep['status']
        if(status.error == false) {
            const categories = rep['categories']
            const object     = {
                categories: categories
            }

            await db.put('ds_categories', object, key)
            return object
        } else if (status.error == true) {

        }
    } else {
        return res
    }
}

async function GetCountries(dataset) {

}

async function GetIndicators(dataset, iso3) {

}

async function GetIndicator(dataset, iso3, ind3) {

}

export {
    GetDatasets,
    GetCategories,
    GetIndicator,
    GetCountries,
    GetIndicators
}