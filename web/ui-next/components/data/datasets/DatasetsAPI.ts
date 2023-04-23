import { 
    IDatasetsResponse,
    IDatasetsObjectsResponse,
    IDatasetsCategoriesResponse,
    IDatasetsIndicatorsResponse,
    IDatasetsIndicatorResponse 
} from "./DatasetsTypes"

import { GET, server } from "../utils"

interface IDatasetsTable {
    WEO: string
}

let DatasetsTable: IDatasetsTable = { 
    WEO: "World Economic Outlook" 
}

async function GetDatasets() : Promise<IDatasetsResponse> { 
    return await GET<IDatasetsResponse>(`${server}/api/v1/datasets`)
}

async function GetObjects(dataset: string) : Promise<IDatasetsObjectsResponse> {
    let url = `${server}/api/v2/datasets/${dataset}/objects`
    return await GET<IDatasetsObjectsResponse>(url)
}

async function GetCategories(dataset: string) : Promise<IDatasetsCategoriesResponse> {
    let url = `${server}/api/v1/datasets/${dataset}/categories`
    return await GET<IDatasetsCategoriesResponse>(url)
}

async function GetIndicators(dataset: string, object_id: string) : Promise<IDatasetsIndicatorsResponse> {
    let url = `${server}/api/v2/datasets/${dataset}/objects/${object_id}/indicators`
    return await GET<IDatasetsIndicatorsResponse>(url);
}

async function GetIndicator(dataset: string, object_id: string, indicator_id: string) : Promise<IDatasetsIndicatorResponse> {
    let url = `${server}/api/v2/datasets/${dataset}/objects/${object_id}/indicators/${indicator_id}`
    return await GET<IDatasetsIndicatorResponse>(url)
}

export type {
    IDatasetsTable
}

export { 
    GetDatasets,
    GetObjects,
    GetCategories,
    GetIndicators,
    DatasetsTable,
    GetIndicator 
}