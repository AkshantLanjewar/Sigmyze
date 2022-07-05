import CreateDB from "../../../data/backend/db"
import { showNotification } from "@mantine/notifications"

async function GetGeojsonTiles() {
    let db  = await CreateDB()
    let key = 'tiles'
    let res = await db.get('map_tiles', key)

    if(res == undefined) {
        let url = "/api/v1/maps/geojson"
        let rep = await (await fetch(url)).json()
        await db.put("map_tiles", rep, key)

        return rep
    }
    else
        return res    
}

async function GetMapData(dataset, ind3) {
    let db  = await CreateDB()
    let key = `${dataset}: ${ind3}`
    let res = await db.get('map_data', key)

    if(res == undefined) {
        let url = `/api/v1/maps/${dataset}/${ind3}`
        let rep = await (await fetch(url)).json()
        await db.put('map_data', rep['data'], key)

        return rep['data']
    }
    else
        return res
}

function SpliceMapData(data, tiles) {
    let data_hash = {}
    for(let i = 0; i < data.length; i++) {
        let point = data[i]

        let object_id = point['ObjectID']
        let val       = point['VAL']

        if(typeof val == 'number')
            data_hash[object_id] = val
    }

    let features = tiles['features']
    for(let i = 0; i < features.length; i++) {
        let feature    = features[i]
        let properties = feature['properties'] 

        let iso3 = properties.ISO_A3
        let val  = null

        if(iso3 in data_hash)
            val = data_hash[iso3]
        
        properties['data']    = val
        feature['properties'] = properties
        features[i]           = feature
    }

    tiles['features'] = features
    return tiles
}

export { GetGeojsonTiles, GetMapData }
export { SpliceMapData }