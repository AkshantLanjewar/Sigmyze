import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { GetDatasetIndicatorById } from "../../../data/quanta/dataset-api"
import QuantaFormattingEngine from "../../formatting-engine"
import { IDatasetCache, IQuantaIndicatorText } from "../types"
import { primeDatasetCache } from "./cache-dataset"
import { ICachedIndicator } from "../types/hooks"

interface IQuantaIndicatorCache {
    [key: string]: ICachedIndicator[]
}

/**
 * @description
 *  - this is the function that handles retreiving an indicator by its ID. it leverages a 8 hour cache in order to save requests
 * @param datasetId 
 *  - this is the id of the dataset being requested
 * @param indicatorId 
 *  - this is the id of the indicator being requested
 * @param indicatorCache 
 *  - this is the current cache of indicators being stored
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 */
const fetchIndicatorCache = async (
    datasetId: string,
    indicatorId: string,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>
) => {
    //first we want to check if the indicator is within the cache
    let cacheKeys = Object.keys(indicatorCache.current)
    let bodyIndex: number | undefined = undefined

    if(cacheKeys.includes(datasetId)) {
        let datasetIndicators = indicatorCache.current[datasetId]
        for(let i = 0; i < datasetIndicators.length; i++) {
            let indicator = datasetIndicators[i]
            if(indicator.indicator.indicatorId === indicatorId) {
                bodyIndex = i

                //now we have to check if the indicator is stale or not
                const day = 1000 * 60 * 60 * 8
                const dayAgo = Date.now() - day
                if(indicator.timestamp < dayAgo)
                    return indicator.indicator
            }
        }
    } else {
        indicatorCache.current[datasetId] = []
    }

    let fetchedIndicator = await GetDatasetIndicatorById(datasetId, indicatorId)
    if(fetchedIndicator === undefined)
        return

    let newBody: ICachedIndicator = {
        timestamp: Date.now(),
        indicator: fetchedIndicator
    }

    if(bodyIndex === undefined) {
        indicatorCache.current[datasetId].push(newBody)
        setICU((step) => !step)
    } else
        indicatorCache.current[datasetId][bodyIndex] = newBody
    
    return fetchedIndicator
}

/**
 * @description
 *  - this is the function that handles deleting an indicator from the cache
 * @param datasetId 
 *  - this is the id of the dataset being requested
 * @param indicatorId 
 *  - this is the id of the indicator being requested
 * @param indicatorCache 
 *  - this is the current cache of indicators being stored
 */
const deleteIndicatorCache = (
    datasetId: string,
    indicatorId: string,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>
) => {
    let datasetIndicators: ICachedIndicator[] | undefined = undefined
    let cacheKeys = Object.keys(indicatorCache.current)

    if(cacheKeys.includes(datasetId) === true)
        datasetIndicators = indicatorCache.current[datasetId]
    if(datasetIndicators === undefined)
        datasetIndicators = []

    let newDatasetIndicators: ICachedIndicator[] = []
    for(let i = 0; i < datasetIndicators.length; i++) {
        let indicator = datasetIndicators[i]
        if(indicator.indicator.indicatorId === indicatorId)
            continue

        newDatasetIndicators.push(indicator)
    }

    indicatorCache.current[datasetId] = newDatasetIndicators
}

/**
 * @description
 *  - this is the function that formats text based on an indicators values
 * @param datasetId
 *  - this is the id of the dataset where the indicator is located in
 * @param indicatorId
 *  - this is the id of the indicator
 * @param text
 *  - this is the string of text we are trying to format
 * @param indicatorCache 
 *  - this is the current cache of indicators being stored
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 */
const formatIndicatorTextCache = async (
    datasetId: string,
    indicatorId: string,
    text: string,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>
) => {
    let indicator = await fetchIndicatorCache(datasetId, indicatorId, indicatorCache, setICU)
    if(indicator === undefined)
        return

    //now we build all the required text for formatting
    let engine = new QuantaFormattingEngine(indicator)
    return engine.format(text)
}

/**
 * @description
 *  - this is the function that fetches an indicator's preformatted text
 * @param datasetId
 *  - this is the id of the dataset where the indicator is located in
 * @param indicatorId
 *  - this is the id of the indicator
 * @param indicatorCache 
 *  - this is the current cache of indicators being stored
 * @param datasetCache 
 *  - this is the dataset prime data cache
 * @param setDCU
 *  - set state used to notify whether or not the dataset cache has updated in size
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 */
const fetchIndicatorTextCache = async (
    datasetId: string,
    indicatorId: string,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    datasetCache: MutableRefObject<IDatasetCache>,
    setDCU: Dispatch<SetStateAction<boolean>>,
    setICU: Dispatch<SetStateAction<boolean>>
) => {
    let dataset = await primeDatasetCache(datasetId, datasetCache, setDCU)
    if(dataset === undefined || dataset.textStore === undefined)
        return

    let textStore = dataset.textStore
    let storeKeys = Object.keys(textStore)

    let titleKey = "formatter::title"
    let shortKey = "formatter::short"
    if(storeKeys.includes(titleKey) === false || storeKeys.includes(shortKey) === false)
        return

    let titleVal = await formatIndicatorTextCache(datasetId, indicatorId, textStore[titleKey], indicatorCache, setICU)
    let shortVal = await formatIndicatorTextCache(datasetId, indicatorId, textStore[shortKey], indicatorCache, setICU)
    if(titleVal === undefined || shortVal === undefined)
        return

    return {
        title: titleVal,
        short: shortVal
    } as IQuantaIndicatorText
}

export {
    fetchIndicatorCache,
    deleteIndicatorCache,
    formatIndicatorTextCache,
    fetchIndicatorTextCache
}