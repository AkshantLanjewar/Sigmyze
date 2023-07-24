import { showNotification } from "@mantine/notifications"
import { GET_Cacheless, GenerateOptions, server } from "../../../data/utils"
import { IPrimeResponse } from "./response"
import { IDatasetCache } from "../types"
import { Dispatch, SetStateAction } from "react"
import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types"
import { GetDatasetIndicatorById } from "../../../data/quanta/dataset-api"

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
    FetchIndicator 
}