import CreateDB from "./db";
import { showNotification } from '@mantine/notifications'

function HandleError(status) {
    let msg = status.msg

    if(msg == "INVALID dataset")
        showNotification({
            title: "Fetch Error",
            message: "You tried to fetch a Dataset that does not exist",
            color: 'red',
            autoClose: 1000 * 10
        })

    if(msg == "INVALID country")
        showNotification({
            title: "Fetch Error",
            message: "You tried to fetch a Country that does not exist in this dataset",
            color: 'red',
            autoClose: 1000 * 10
        })

    if(msg == "INVALID indicator")
        showNotification({
            title: "Fetch Error",
            message: "You tried to fetch an Indicator that does not exist for this country",
            color: 'red',
            autoClose: 1000 * 10
        })
}

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
    } else
        return res
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
        } 
        
        if (status.error == true) {
            HandleError(status)
            return status
        }
    } else
        return res
}

async function GetCountries(dataset) {
    let db  = await CreateDB()
    let key = dataset.toLowerCase()
    let res = await db.get('ds_countries', key)

    if(res == undefined) {
        let url = `/api/v1/datasets/${key}/countries`
        let rep = await (await fetch(url)).json()

        let status = rep['status']
        if(status.error == false) {
            let countries = rep['countries']
            const object  = {
                countries: countries
            }

            await db.put('ds_countries', object, key)
            return object
        } 
        
        if (status.error == true) {
            HandleError(status)
            return status
        }
    } else
        return res
}

async function GetIndicators(dataset, iso3) {
    let db  = await CreateDB()
    dataset = dataset.toLowerCase()
    iso3    = iso3.toLowerCase()

    let key = `${dataset}_${iso3}`
    let res = await db.get('ds_indicators', key)

    if(res == undefined) {
        let url = `/api/v1/datasets/${dataset}/countries/${iso3}/indicators`
        let rep = await (await fetch(url)).json()

        let status = rep['status']
        if(status.error == false) {
            let indicators = rep['indicators']
            const object   = {
                indicators: indicators
            }

            await db.put('ds_indicators', object, key)
            return object
        } 
        
        if (status.error == true) {
            HandleError(status)
            return status
        }
    } else
        return res
}

async function GetIndicator(dataset, iso3, ind3) {
    let db  = await CreateDB()
    dataset = dataset.toLowerCase()
    iso3    = iso3.toLowerCase()
    ind3    = ind3.toLowerCase()

    let key = `${dataset}_${iso3}_${ind3}`
    let res = await db.get('ds_indicator', key)

    if(res == undefined) {
        let url = `/api/v1/datasets/${dataset}/countries/${iso3}/indicators/${ind3}`
        let rep = await (await fetch(url)).json()

        let status = rep['status']
        if(status.error == false) {
            let country = rep['country']
            let s_name  = rep['simpleName']
            let p_data  = rep['data']

            for(let i = 0; i < p_data.length; i++) {
                let data = p_data[i]

                data['date']  = parseInt(data['date'])
                data['value'] = parseFloat(data['value'])
                p_data[i] = data
            }

            const object = {
                iso3: iso3,
                country: country,
                ind3: ind3,
                simpleName: s_name,
                data: p_data
            }

            await db.put('ds_indicator', object, key)
            return object
        } 
        
        if (status.error == true) {
            HandleError(status)
            return status
        }
    } else
        return res
}

export {
    GetDatasets,
    GetCategories,
    GetIndicator,
    GetCountries,
    GetIndicators
}