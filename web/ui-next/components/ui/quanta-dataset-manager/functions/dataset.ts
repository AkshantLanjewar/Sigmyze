import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types"
import QuantaFormattingEngine from "../../formatting-engine"
import { IDatasetCache, IDatasetCacheObject, IQuantaIndicatorText } from "../types"

const getDatasetSelectors = (datasetId: string, datasetCache: IDatasetCache) => {
    let cacheKeys = Object.keys(datasetCache)
    if(cacheKeys.includes(datasetId) == false)
        return undefined

    let cacheObject = datasetCache[datasetId]
    return cacheObject.selectors
}

const getDatasetCategorization = (datasetId: string, datasetCache: IDatasetCache) => {
    let cacheKeys = Object.keys(datasetCache)
    if(cacheKeys.includes(datasetId) == false)
        return undefined

    let cacheObject = datasetCache[datasetId]
    return cacheObject.categorization
}

const getDatasetText = (datasetId: string, type: string, datasetCache: IDatasetCache) => {
    let cacheKeys = Object.keys(datasetCache)
    if(cacheKeys.includes(datasetId) == false)
        return undefined

    let cacheObject = datasetCache[datasetId]
    switch(type) {
        case "name":
            return cacheObject.dataset_name
        case "id":
            return cacheObject.dataset_id
        case "description":
            return cacheObject.dataset_description
        default:
            return undefined
    }
}

const formatIndicatorText = async (
    datasetId: string, 
    indicatorId: string, 
    text: string,
    fetchIndicator: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicator | undefined>
) => {
    let indicator = await fetchIndicator(datasetId, indicatorId)
    if(indicator === undefined)
        return

    //now we build all the required text for formatting
    let engine = new QuantaFormattingEngine(indicator)
    return engine.format(text)
}

const fetchIndicatorText = async (
    datasetId: string, 
    indicatorId: string,
    primeDataset: (datasetId: string) => Promise<IDatasetCacheObject | undefined>,
    formatIndicatorText: (datasetId: string, indicatorId: string, text: string) => Promise<string | undefined>
) => {
    let dataset = await primeDataset(datasetId)
    if(dataset === undefined)
        return

    let textStore = dataset.textStore
    let storeKeys = Object.keys(textStore)

    let titleKey = "formatter::title"
    let shortKey = "formatter::short"
    if(storeKeys.includes(titleKey) === false || storeKeys.includes(shortKey) === false)
        return

    let titleVal = await formatIndicatorText(datasetId, indicatorId, textStore[titleKey])
    let shortVal = await formatIndicatorText(datasetId, indicatorId, textStore[shortKey])
    if(titleVal === undefined || shortVal === undefined)
        return

    return {
        title: titleVal,
        short: shortVal
    } as IQuantaIndicatorText
}

export { 
    getDatasetSelectors,
    getDatasetCategorization,
    getDatasetText,
    formatIndicatorText,
    fetchIndicatorText 
}