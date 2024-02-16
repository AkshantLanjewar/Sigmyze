import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { IQuantaQuery } from "../../../quanta/selector-frame/types"
import { IQuantaIndicatorLoc } from "../../../lunar-refresh/data-manager/state"
import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types"
import { fetchIndicatorCache } from "."
import { GetDatasetIndicatorsPaged, SelectDatasetIndicator, SelectPagedDatasetIndicators } from "../../../data/quanta/dataset-api"
import { ICachedIndicator, ICachedQuery, ICachedQueryBody } from "../types/hooks"

interface IQuantaIndicatorCache {
    [key: string]: ICachedIndicator[]
}

/**
 * @description
 *  - this is a utility function that converts a set of indicator locs into validated quanta indicatoers from the cache 
 * @param indicators 
 *  - this list of locations needing to be serialized into data
 * @param indicatorCache 
 *  - the current cache of indicators
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 */
const validateIndicatorLocs = async (
    indicators: IQuantaIndicatorLoc[],
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>
) => {
    let output: IQuantaIndicator[] = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let fetchedIndicator = await fetchIndicatorCache(indicator.datasetId, indicator.indicatorId, indicatorCache, setICU)
        if(fetchedIndicator === undefined)
            continue

        output.push(fetchedIndicator)
    }

    return output
}

/**
 * @description
 *  - this is a utility function that inserts a fetched indicator into the cache so that other functions may use its cached data as well
 * @param datasetId 
 *  - this is the id of the dataset in which the indicator is located in
 * @param indicator 
 *  - this is the indicator that was fetched
 * @param indicatorCache 
 *  - this is the current cache of indicators
 */
const insertIndicatorIntoCache = async (
    datasetId: string,
    indicator: IQuantaIndicator,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>
): Promise<IQuantaIndicatorLoc> => {
    let timestamp = Date.now()
    let cachedIndicators: ICachedIndicator[] = []
    if(Object.keys(indicatorCache.current).includes(datasetId))
        cachedIndicators = indicatorCache.current[datasetId]

    let cacheIndex: number | undefined = undefined
    for(let i = 0; i < cachedIndicators.length; i++) {
        let cachedIndicator = cachedIndicators[i]
        if(cachedIndicator.indicator.indicatorId === indicator.indicatorId)
            cacheIndex = i
    }
    
    const day = 1000 * 60 * 60 * 16
    let cacheObject: ICachedIndicator = { timestamp, indicator, expires: Date.now() + day }
    if(cacheIndex === undefined) {
        cachedIndicators.push(cacheObject)
        setICU((step) => !step)
    } else
        cachedIndicators[cacheIndex] = cacheObject

    indicatorCache.current[datasetId] = cachedIndicators

    return {
        datasetId: datasetId,
        indicatorId: indicator.indicatorId!
    }
}

interface IGetQueryCacheIndicatorsOutput {
    bodyIndex: number | undefined,
    indicators: IQuantaIndicatorLoc[] | undefined
}

/**
 * @description
 *  - this is the utility function that checks if there is a query already within the cache
 * @param datasetId 
 *  - this is the dataset where we are executing the query
 * @param query 
 *  - this is the string based query, used to match up the objects in the cache
 * @param queryCache 
 *  - this is the cache of queries that have been executed
 */
const getQueryCacheIndicators = (
    datasetId: string,
    query: string,
    queryCache: MutableRefObject<ICachedQuery>,
): IGetQueryCacheIndicatorsOutput => {
    let querySTR = query
    let queryKeys = Object.keys(queryCache.current)
    if(queryKeys.includes(datasetId) === false) {
        queryCache.current[datasetId] = []
        return { bodyIndex: undefined, indicators: undefined }
    }

    //now we need to find the correct query body within the dataset
    let body: ICachedQueryBody | undefined = undefined
    let bodyIndex: number | undefined = undefined

    for(let i = 0; i < queryCache.current[datasetId].length; i++) {
        let _body = queryCache.current[datasetId][i]
        if(_body.query === querySTR) {
            body = _body
            bodyIndex = i
        }
    }

    if(body === undefined)
        return { bodyIndex, indicators: undefined }

    let timestamp = body.timestamp
    if(timestamp < body.expires)
        return { bodyIndex, indicators: undefined }

    return {
        bodyIndex: bodyIndex,
        indicators: body.indicators
    }
}

/**
 * @description
 *  - this is the select indicators function wrapped with a cache in order to increase performance
 * @param datasetId 
 *  - this is the id of the dataset we want to execute the query in
 * @param query 
 *  - these are the query parameters
 * @param queryCache 
 *  - the cache used to track query results
 * @param indicatorCache 
 *  - the cache of indicators currently within the data manager
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 * @param setQCU
 *  - this is the function that indicates whether or not a query has been added
 */
const selectIndicatorsCache = async (
    datasetId: string,
    query: IQuantaQuery[],
    queryCache: MutableRefObject<ICachedQuery>,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>,
    setQCU: Dispatch<SetStateAction<boolean>>
) => {
    //convert the query into a string for deep equal check
    let queryStr = JSON.stringify(query)

    //first we need to go through and figure out whether or not we have a valid cache entry
    let potentialBody = getQueryCacheIndicators(datasetId, queryStr, queryCache)
    let bodyIndex = potentialBody.bodyIndex
    if(potentialBody.indicators !== undefined)
        return await validateIndicatorLocs(potentialBody.indicators, indicatorCache, setICU)

    //now we have to make the actual request and fetch the indicators
    let indicators = await SelectDatasetIndicator(datasetId, query)
    if(indicators === undefined)
        return

    //first we will go through to insert them creating the locatinos
    let indicatorLocs: IQuantaIndicatorLoc[] = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let indicatorLoc = await insertIndicatorIntoCache(datasetId, indicator, indicatorCache, setICU)
        indicatorLocs.push(indicatorLoc)
    }

    //creating the new body and inserting it
    const day = 1000 * 60 * 60 * 16
    const expires = Date.now() + day
    let newBody: ICachedQueryBody = {
        timestamp: Date.now(),
        query: queryStr,
        indicators: indicatorLocs,
        expires
    }

    if(bodyIndex === undefined) {
        queryCache.current[datasetId].push(newBody)
        setQCU((step) => !step)
    } else
        queryCache.current[datasetId][bodyIndex] = newBody

    return indicators
}

/**
 * @description
 *  - this is the function that pages through a select query leveraging the cache to increase performance
 * @param datasetId 
 *  - this is the id of the dataset we are querying
 * @param query 
 *  - this is the actual indicator query
 * @param pageLength 
 *  - the page length
 * @param page 
 *  - the page index starting with 0
 * @param queryCache 
 *  - the current cache of queries
 * @param indicatorCache 
 *  - the current cache of indicators
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 * @param setQCU
 *  - this is the function that indicates whether or not a query has been added
 */
const selectIndicatorsPagedCache = async (
    datasetId: string,
    query: IQuantaQuery[],
    pageLength: number,
    page: number,
    queryCache: MutableRefObject<ICachedQuery>,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>,
    setQCU: Dispatch<SetStateAction<boolean>>
) => {
    //convert the query into a string for deep equal check
    let querySTR = JSON.stringify(query) + `[${pageLength}]::[${page}]`
    //first we need to go through and figure out whether or not we have a valid cache entry
    let potentialBody = getQueryCacheIndicators(datasetId, querySTR, queryCache)
    let bodyIndex = potentialBody.bodyIndex
    if(potentialBody.indicators !== undefined)
        return await validateIndicatorLocs(potentialBody.indicators, indicatorCache, setICU)

    let indicators = await SelectPagedDatasetIndicators(datasetId, query, pageLength, page)
    if(indicators === undefined)
        return

    //first we will go through to insert them creating the locatinos
    let indicatorLocs: IQuantaIndicatorLoc[] = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let indicatorLoc = await insertIndicatorIntoCache(datasetId, indicator, indicatorCache, setICU)
        indicatorLocs.push(indicatorLoc)
    }

    //creating the new body and inserting it
    const day = 1000 * 60 * 60 * 16
    const expires = Date.now() + day
    let newBody: ICachedQueryBody = {
        timestamp: Date.now(),
        query: querySTR,
        indicators: indicatorLocs,
        expires
    }

    if(bodyIndex === undefined) {
        queryCache.current[datasetId].push(newBody)
        setQCU((step) => !step)
    } else
        queryCache.current[datasetId][bodyIndex] = newBody

    return indicators
}

/**
 * @description
 *  - this is the function that pages a dataset using the caching mechanism
 * @param datasetId 
 *  - this is the id of the dataset we are paging
 * @param pageLength 
 *  - the length of the page
 * @param page 
 *  - the index of the page, starting with 0
 * @param queryCache 
 *  - the cache of queries that have been executed
 * @param indicatorCache 
 *  - the cache of indicators within the store
 * @param setICU
 *  - this is the function that indicates whether or not an indicator has been added
 * @param setQCU
 *  - this is the function that indicates whether or not a query has been added
 */
const queryIndicatorsPagedCache = async (
    datasetId: string, 
    pageLength: number, 
    page: number,
    queryCache: MutableRefObject<ICachedQuery>,
    indicatorCache: MutableRefObject<IQuantaIndicatorCache>,
    setICU: Dispatch<SetStateAction<boolean>>,
    setQCU: Dispatch<SetStateAction<boolean>>
) => {
    //since this is still a form of query, we will be forming a custom query string
    let querySTR = `[${pageLength}]::[${page}]`

    //first we need to go through and figure out whether or not we have a valid cache entry
    let potentialBody = getQueryCacheIndicators(datasetId, querySTR, queryCache)
    let bodyIndex = potentialBody.bodyIndex
    if(potentialBody.indicators !== undefined)
        return await validateIndicatorLocs(potentialBody.indicators, indicatorCache, setICU)

    let indicators = await GetDatasetIndicatorsPaged(datasetId, pageLength, page)
    if(indicators === undefined)
        return

    //first we will go through to insert them creating the locatinos
    let indicatorLocs: IQuantaIndicatorLoc[] = []
    for(let i = 0; i < indicators.length; i++) {
        let indicator = indicators[i]
        let indicatorLoc = await insertIndicatorIntoCache(datasetId, indicator, indicatorCache, setICU)
        indicatorLocs.push(indicatorLoc)
    }

    //creating the new body and inserting it
    const day = 1000 * 60 * 60 * 16
    const expires = Date.now() + day
    let newBody: ICachedQueryBody = {
        timestamp: Date.now(),
        query: querySTR,
        indicators: indicatorLocs,
        expires
    }

    if(bodyIndex === undefined) {
        queryCache.current[datasetId].push(newBody)
        setQCU((step) => !step)
    } else
        queryCache.current[datasetId][bodyIndex] = newBody

    return indicators
}

export {
    selectIndicatorsCache,
    selectIndicatorsPagedCache,
    queryIndicatorsPagedCache
}