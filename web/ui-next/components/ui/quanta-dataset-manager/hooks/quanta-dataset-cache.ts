import { useCallback, useEffect, useRef, useState } from "react"
import { IDatasetCache } from "../types"
import { 
    deleteIndicatorCache, 
    fetchDatasetEditorCache, 
    fetchIndicatorCache, 
    fetchIndicatorTextCache, 
    formatIndicatorTextCache, 
    getDatasetCategorizationCache, 
    getDatasetSelectorsCache, 
    getDatasetTextCache, 
    getPublicDatasetCardsCache, 
    indicatorsLengthCache, 
    primeDatasetCache, 
    queryIndicatorsLengthCache, 
    queryIndicatorsPagedCache, 
    selectIndicatorsCache,
    selectIndicatorsPagedCache
} from "../functions"

import { IQuantaQuery } from "../../../quanta/selector-frame/types"
import { ICachedIndicator, IDatasetCardCache, IDatasetProjectCache, ICachedQuery, ICachedLength } from "../types/hooks"


interface IQuantaIndicatorCache {
    [key: string]: ICachedIndicator[]
}

/**
 * This is the hook that handles the dataset cache
 */
const useQuantaDatasetCache = () => {
    //dataset cache NOTE: dcu stands for dataset cache updated
    const datasetCache = useRef<IDatasetCache>({})
    const [dcu, setDCU] = useState<boolean>(false)

    //this is the effect that manages the dataset cache size to make sure there are no more than 100 entries
    useEffect(() => {
        let cacheKeys = Object.keys(datasetCache.current)
        let entries = cacheKeys.length
        if(entries <= 100)
            return

        //we want to pop the first 5 keys
        for(let i = 0; i < 5; i++) {
            let key = cacheKeys[i]
            delete datasetCache.current[key]
        }
    }, [dcu])

    //dataset card cache
    const datasetCardCache = useRef<IDatasetCardCache | null>(null)
    //dataset editor cache NOTE: deu stands for dataset editor cache updated
    const datasetEditorCache = useRef<IDatasetProjectCache[]>([])
    const [deu, setDEU] = useState<boolean>(false)

    
    useEffect(() => {
        let currentDatasetEditorCache = datasetEditorCache.current
        if(currentDatasetEditorCache.length <= 100)
            return

        //pop 2 elements
        currentDatasetEditorCache.shift()
        currentDatasetEditorCache.shift()
        datasetEditorCache.current = currentDatasetEditorCache
    }, [deu])

    //this is the quanta indicator cache NOTE: icu stands for indicator cache updated
    const indicatorCache = useRef<IQuantaIndicatorCache>({})
    const [icu, setICU] = useState<boolean>(false)

    //this is the effect to make sure no more than 250 indicators are cached at any given time
    useEffect(() => {
        let indicatorEntries = 0
        let cacheKeys = Object.keys(indicatorCache.current)
        for(let i = 0; i < cacheKeys.length; i++) {
            let key = cacheKeys[i]
            let entryLength = indicatorCache.current[key].length
            indicatorEntries += entryLength
        }

        if(indicatorEntries <= 250)
            return

        //go through and pop 5 indicators from the total cache
        let popIndicators = Math.ceil(5 / cacheKeys.length)
        for(let i = 0; i < cacheKeys.length; i++) {
            let entry = indicatorCache.current[cacheKeys[i]]
            for(let x = 0; x < popIndicators; x++)
                entry.shift()

            indicatorCache.current[cacheKeys[i]] = entry
        }
    }, [icu])

    //this is the quanta query cache
    const queryCache = useRef<ICachedQuery>({})
    const [qcu, setQCU] = useState<boolean>(false)

    //this is the effect to make sure no more than 500 queries are cached at any given time
    useEffect(() => {
        let queryEntries = 0
        let keys = Object.keys(queryCache.current)
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let entryLength = queryCache.current[key].length
            queryEntries += entryLength
        }

        if(queryEntries <= 500)
            return 

        //go through and pop 10 queries from the total cache
        let popQueries = Math.ceil(10 / keys.length)
        for(let i = 0; i < keys.length; i++) {
            let entry = queryCache.current[keys[i]]
            for(let x = 0; x < popQueries; x++)
                entry.shift()

            queryCache.current[keys[i]] = entry
        }
    }, [qcu])

    //this is the quanta length cache NOTE: lcu stands for length cache updated
    const lengthCache = useRef<ICachedLength>({})
    const [lcu, setLCU] = useState<boolean>(false)

    //this is the effect to make sure no more than 1000 length queries are cached at any given time
    useEffect(() => {
        let lengthEntries = 0
        let keys = Object.keys(lengthCache.current)
        for(let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let entryLength = lengthCache.current[i].length
            lengthEntries += entryLength
        }

        if(lengthEntries <= 1000)
            return

        //go through and pop 20 length items from the total cache
        let popLength = Math.ceil(20 / keys.length)
        for(let i = 0; i < keys.length; i++) {
            let entry = lengthCache.current[keys[i]]
            for(let x = 0; x < popLength; x++)
                entry.shift()

            lengthCache.current[keys[i]] = entry
        }
    }, [lcu])

    //this is the function that fetches an indicator, either from the server or from the cache
    const fetchIndicator = useCallback(async (datasetId: string, indicatorId: string) => {
        return await fetchIndicatorCache(datasetId, indicatorId, indicatorCache, setICU)
    }, [])

    //this is the function that handles deleting the indicator from the cache
    const deleteIndicator = useCallback((datasetId: string, indicatorId: string) => {
        deleteIndicatorCache(datasetId, indicatorId, indicatorCache)
    }, [])

    //this is the function to format indicator text
    const formatIndicatorText = useCallback((datasetId: string, indicatorId: string, text: string) => {
        return formatIndicatorTextCache(datasetId, indicatorId, text, indicatorCache, setICU)
    }, [])

    //this is the function to fetch an indicator's labels
    const fetchIndicatorText = useCallback((datasetId: string, indicatorId: string) => {
        return fetchIndicatorTextCache(datasetId, indicatorId, indicatorCache, datasetCache, setDCU, setICU)
    }, [])

    //this is the function to run a select indicator query leveraging the cache
    const selectIndicators = useCallback((datasetId: string, query: IQuantaQuery[]) => {
        return selectIndicatorsCache(datasetId, query, queryCache, indicatorCache, setICU, setQCU)
    }, [])

    //this is the function to page through a select indicator query leveraging the cache
    const selectIndicatorsPaged = useCallback((datasetId: string, query: IQuantaQuery[], pageLength: number, page: number) => {
        return selectIndicatorsPagedCache(datasetId, query, pageLength, page, queryCache, indicatorCache, setICU, setQCU)
    }, [])

    //this is the function that pages through all of the indicators in the dataset
    const queryIndicatorsPaged = useCallback((datasetId: string, pageLength: number, page: number) => {
        return queryIndicatorsPagedCache(datasetId, pageLength, page, queryCache, indicatorCache, setICU, setQCU)
    }, [])

    //this is the function that returns the amount of indicators a query returns
    const queryIndicatorsLength = useCallback((datasetId: string, query: IQuantaQuery[]) => {
        return queryIndicatorsLengthCache(datasetId, query, lengthCache, setLCU)
    }, [])

    //this is the function that returns the total amount of indicators within a dataset
    const indicatorsLength = useCallback((datasetId: string) => indicatorsLengthCache(datasetId, lengthCache, setLCU), [])

    //this is the function that handles priming the dataset using the cache
    const primeDataset = useCallback((datasetId: string) => primeDatasetCache(datasetId, datasetCache, setDCU), [])

    //this is the function that fetches the dataset editors
    const fetchDatasetEditor = useCallback((datasetId: string) => fetchDatasetEditorCache(datasetId, datasetEditorCache, setDEU), [])

    //this is the function to get the dataset selectors
    const getDatasetSelectors = useCallback((datasetId: string) => getDatasetSelectorsCache(datasetId, datasetCache, setDCU), [])

    //this is the function to get the dataset categorization
    const getDatasetCategorization = useCallback((datasetId: string) => getDatasetCategorizationCache(datasetId, datasetCache, setDCU), [])

    //this is the function to get a text field from a dataset
    const getDatasetText = useCallback((datasetId: string, type: string) => getDatasetTextCache(datasetId, type, datasetCache, setDCU), [])

    //this is the function that gets all the public dataset cards
    const getPublicDatasetCards = useCallback(() => getPublicDatasetCardsCache(datasetCardCache), [])

    return {
        fetchIndicator,
        deleteIndicator,
        formatIndicatorText,
        fetchIndicatorText,
        selectIndicators,
        selectIndicatorsPaged,
        queryIndicatorsPaged,
        queryIndicatorsLength,
        indicatorsLength,
        primeDataset,
        fetchDatasetEditor,
        getDatasetSelectors,
        getDatasetCategorization,
        getDatasetText,
        getPublicDatasetCards
    }
}


export { useQuantaDatasetCache }