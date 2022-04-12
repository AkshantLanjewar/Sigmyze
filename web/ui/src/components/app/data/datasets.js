import CreateDB from "./db";

async function GetDatasets() {
    let db  = await CreateDB()
    let key = 'datasets'
    let res = await db.get('ds_datasets', key)
    
    if(res == undefined) {

    } else {
        
    }
}

async function GetCategories(dataset) {

}

async function GetCountries(dataset) {

}

async function GetIndicators(dataset, iso3) {

}

async function GetIndicator(dataset, iso3, ind3) {

}

export {
    GetCategories,
    GetIndicator,
    GetCountries,
    GetIndicators
}