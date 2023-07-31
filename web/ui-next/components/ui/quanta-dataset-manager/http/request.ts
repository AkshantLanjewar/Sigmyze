import { showNotification } from "@mantine/notifications"
import { GET_Cacheless, GenerateOptions, server } from "../../../data/utils"
import { IDatasetEditorResponse, IPrimeResponse } from "./response"
import { IDatasetCache, IDatasetProjects } from "../types"
import { Dispatch, SetStateAction } from "react"
import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types"
import { GetDatasetIndicatorById } from "../../../data/quanta/dataset-api"

const FetchDatasetEditor = async (
    datasetId: string,
    fetchDatasetEditor: (datasetId: string) => IDatasetProjects | undefined,
    addDatasetEditor: (dataset: IDatasetProjects) => void
) => {
    let editor = fetchDatasetEditor(datasetId)
    if(editor !== undefined)
        return editor

    //now we have to fetch the editor information from the server
    const url = `${server}/api/v2/dataset/${datasetId}/node-editors`
    const options = GenerateOptions("GET", null)
    const response = await GET_Cacheless<IDatasetEditorResponse>(url, options)

    if(response.status?.error === true || response.fetchEditor === undefined || response.updateEditor === undefined) {
        showNotification({
            title: "Data Error",
            message: "Unfortunately, we had an issue fetching this dataset's editors, please try again",
            color: 'red',
            autoClose: 1000 * 10
        })

        return
    }

    let newDatasetEditor: IDatasetProjects = {
        datasetId: datasetId,
        fetchEditor: response.fetchEditor,
        updateEditor: response.updateEditor
    }

    addDatasetEditor(newDatasetEditor)
    return newDatasetEditor
}

const PrimeDataset = async (
    datasetId: string, 
    datasetCache: IDatasetCache, 
    setDatasetCache: Dispatch<SetStateAction<IDatasetCache>>
) => {
    //before we do any fetching, we are going to check if we have already retrieved the dataset, and if so, to return that object
    let cacheKeys = Object.keys(datasetCache)
    if(cacheKeys.includes(datasetId)) {
        let shellObject = datasetCache[datasetId]
        return shellObject
    }

    const url = `${server}/api/v2/dataset/${datasetId}/prime`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<IPrimeResponse>(url, options)

    if(resp.status?.error === true || resp.shellObject === undefined) {
        showNotification({
            title: "Data Error",
            message: "Unfortunately, we had an issue fetching this dataset, please try again",
            color: 'red',
            autoClose: 1000 * 10
        })

        return
    }

    //now we update the dataset cache with the new dataset
    let nDatasetCache = datasetCache
    nDatasetCache[datasetId] = resp.shellObject
    setDatasetCache({ ...nDatasetCache })

    return resp.shellObject
}

const FetchIndicator = async (
    datasetId: string,
    indicatorId: string,
    isCached: (datasetId: string, indicatorId: string) => boolean,
    cacheIndicator: (datasetId: string, indicator: IQuantaIndicator) => void,
    getIndicator: (datasetId: string, indicatorId: string) => IQuantaIndicator | undefined
) => {
    if(isCached(datasetId, indicatorId) === true) {
        let indicator = getIndicator(datasetId, indicatorId)
        return indicator
    }

    //use the public dataset api to fetch the indicator
    let nIndicator = await GetDatasetIndicatorById(datasetId, indicatorId)
    if(nIndicator === undefined)
        return

    cacheIndicator(datasetId, nIndicator)
    return nIndicator
}

export { 
    PrimeDataset,
    FetchIndicator,
    FetchDatasetEditor 
}