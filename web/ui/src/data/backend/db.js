import { openDB } from 'idb/with-async-ittr'

async function CreateDB() {
    const db = await openDB('sigmyze', 3, {
        upgrade(db) {
            //create stores
            let storeNames = db.objectStoreNames
            let keys       = []
            for(const x in storeNames)
                keys.push(storeNames[x])  

            let datasetsStore, categoriesStore, countriesStore, indicatorStore, indicatorsStore, tileStore, mapStore
            if(!keys.includes('ds_datasets'))
                datasetsStore   = db.createObjectStore('ds_datasets') 
            if(!keys.includes('ds_categories'))
                categoriesStore = db.createObjectStore('ds_categories')
            if(!keys.includes('ds_countries'))
                countriesStore  = db.createObjectStore('ds_countries')
            if(!keys.includes('ds_indicator'))
                indicatorStore  = db.createObjectStore("ds_indicator")
            if(!keys.includes('ds_indicators'))
                indicatorsStore = db.createObjectStore("ds_indicators")
            if(!keys.includes('map_tiles'))
                tileStore = db.createObjectStore("map_tiles")
            if(!keys.includes('map_data'))
                mapStore = db.createObjectStore('map_data')
        }
    })

    return db
}

export default CreateDB