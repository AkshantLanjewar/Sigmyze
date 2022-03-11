import { openDB } from 'idb/with-async-ittr.js'

async function CreateDB() {
    const db = await openDB('sigmyze', 1, {
        upgrade(db) {
            //create stores
            const indicatorStore         = db.createObjectStore('indicator_v')
            const countryIndicatorsStore = db.createObjectStore('country_indicators') 
        }
    })

    return db
}

export default CreateDB