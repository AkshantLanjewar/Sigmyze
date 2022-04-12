import { openDB } from 'idb/with-async-ittr.js'

async function CreateDB() {
    const db = await openDB('sigmyze', 1, {
        upgrade(db) {
            //create stores
            const datasetsStore   = db.createObjectStore('ds_datasets') 
            const categoriesStore = db.createObjectStore('ds_categories')
            const countriesStore  = db.createObjectStore('ds_countries')
            const indicatorStore  = db.createObjectStore("ds_indicator")
            const indicatorsStore = db.createObjectStore("ds_indicators")
        }
    })

    return db
}

export default CreateDB