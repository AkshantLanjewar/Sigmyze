import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { IDatasetCache, IDatasetManagerState, IQuantaIndicatorCache, IQuantaIndicatorShell } from "./types"
import { FetchIndicator, PrimeDataset } from "./http"
import { fetchIndicatorText, formatIndicatorText, getDatasetCategorization, getDatasetSelectors, getDatasetText } from "./functions"
import { IQuantaIndicator } from "../../quanta/quanta-indicator-manager/types"

interface IQuantaDatasetManagerProps {
    children?: JSX.Element | never[]
}

const QuantaDatasetManagerData = createContext<IDatasetManagerState | null>(null)

const QuantaDatasetManager: React.FC<IQuantaDatasetManagerProps> = ({ children }) => {
    //dataset cache
    const [datasetCache, setDatasetCache] = useState<IDatasetCache>({})
    //indicator cache
    const [indicatorCache, setIndicatorCache] = useState<IQuantaIndicatorCache>({})
    const [cachedIndicators, setCachedIndicators] = useState<IQuantaIndicatorShell[]>([])

    //here are some utilities to help interface with the indicator cache
    const isCached = useCallback((datasetId: string, indicatorId: string) => {
        for(let i = 0; i < cachedIndicators.length; i++) {
            let indicator = cachedIndicators[i]
            if(indicator.datasetId === datasetId && indicator.indicatorId === indicatorId)
                return true
        }
        
        return false
    }, [cachedIndicators])

    const cacheIndicator = useCallback((datasetId: string, indicator: IQuantaIndicator) => {
        let cacheKeys = Object.keys(indicatorCache)
        if(cacheKeys.includes(datasetId) === false)
            return
        if(indicator.indicatorId === undefined || isCached(datasetId, indicator.indicatorId) === true)
            return

        let newCachedIndicators = [ ...cachedIndicators, { datasetId: datasetId, indicatorId: indicator.indicatorId } as IQuantaIndicatorShell ]
        let newIndicatorCache = indicatorCache
        newIndicatorCache[datasetId].push(indicator)

        setIndicatorCache({ ...newIndicatorCache })
        setCachedIndicators([ ...newCachedIndicators ])
    }, [indicatorCache, cachedIndicators, isCached])

    const getIndicator = useCallback((datasetId: string, indicatorId: string) => {
        let cacheKeys = Object.keys(indicatorCache)
        if(cacheKeys.includes(datasetId) === false || isCached(datasetId, indicatorId) === false)
            return undefined

        let indicatorList = indicatorCache[datasetId]
        for(let i = 0; i < indicatorList.length; i++) {
            let option = indicatorList[i]
            if(option.indicatorId === indicatorId)
                return option
        }

        return undefined
    }, [isCached, indicatorCache])

    const deleteIndicator = useCallback((datasetId: string, indicatorId: string) => {
        let cacheKeys = Object.keys(indicatorCache)
        if(cacheKeys.includes(datasetId) === false || isCached(datasetId, indicatorId) === false)
            return undefined

        let indicatorList = indicatorCache[datasetId]
        let nIndicatorList = [] as IQuantaIndicator[]
        for(let i = 0; i < indicatorList.length; i++) {
            let indicator = indicatorList[i]
            if(indicator.indicatorId === indicatorId)
                continue

            nIndicatorList.push(indicator)
        }

        let nIndicatorCache = indicatorCache
        nIndicatorCache[datasetId] = nIndicatorList
        let nCachedIndicators = [] as IQuantaIndicatorShell[]
        for(let i = 0; i < cachedIndicators.length; i++) {
            let indicator = cachedIndicators[i]
            if(indicator.datasetId === datasetId && indicator.indicatorId === indicatorId)
                continue

            nCachedIndicators.push(indicator)
        }

        setIndicatorCache({ ...nIndicatorCache })
        setCachedIndicators([ ...cachedIndicators ])
    }, [indicatorCache, cachedIndicators, isCached])

    //effect that limits the size of the datasetCache to 50
    useEffect(() => {
        let cacheKeys = Object.keys(datasetCache)
        if((cacheKeys.length > 50) == false)
            return

        let nDatasetCache = datasetCache
        let topKey = cacheKeys[0]
        delete nDatasetCache[topKey]

        setDatasetCache({ ...nDatasetCache })
    }, [datasetCache])

    //effect that limits the size of the indicatorCache to 80
    useEffect(() => {
        let cachedShift = cachedIndicators.shift()
        if((cachedIndicators.length > 80) === false || cachedShift === undefined)
            return
            
        deleteIndicator(cachedShift.datasetId, cachedShift.indicatorId)
    }, [cachedIndicators])

    //here are all the methods that will be a part of the dataset manager
    const primeDatasetCallback = useCallback(async (datasetId: string) => {
        return await PrimeDataset(datasetId, datasetCache, setDatasetCache)
    }, [datasetCache])

    const fetchIndicatorCallback = useCallback(async (datasetId: string, indicatorId: string) => {
        return await FetchIndicator(datasetId, indicatorId, isCached, cacheIndicator, getIndicator)
    }, [isCached, cacheIndicator, getIndicator])

    const formatIndicatorTextCallback = useCallback(async (datasetId: string, indicatorId: string, text: string) => {
        return await formatIndicatorText(datasetId, indicatorId, text, fetchIndicatorCallback)
    }, [fetchIndicatorCallback])

    const fetchIndicatorTextCallback = useCallback(async (datasetId: string, indicatorId: string) => {
        return await fetchIndicatorText(datasetId, indicatorId, primeDatasetCallback, formatIndicatorTextCallback)
    }, [primeDatasetCallback, formatIndicatorTextCallback])

    const getDatasetSelectorsCallback = useCallback((datasetId: string) => {
        return getDatasetSelectors(datasetId, datasetCache)
    }, [datasetCache])

    const getDatasetCategorizationCallback = useCallback((datasetId: string) => {
        return getDatasetCategorization(datasetId, datasetCache)
    }, [datasetCache])

    const getDatasetTextCallback = useCallback((datasetId: string, type: string) => {
        return getDatasetText(datasetId, type, datasetCache)
    }, [datasetCache])
    
    const memoValue: IDatasetManagerState = useMemo(() => ({
        primeDataset: primeDatasetCallback,
        fetchIndicator: fetchIndicatorCallback,
        getDatasetSelectors: getDatasetSelectorsCallback,
        getDatasetCategorization: getDatasetCategorizationCallback,
        getDatasetText: getDatasetTextCallback,
        formatIndicatorText: formatIndicatorTextCallback,
        fetchIndicatorText: fetchIndicatorTextCallback
    }), [
        primeDatasetCallback,
        fetchIndicatorCallback,
        getDatasetSelectorsCallback,
        getDatasetCategorizationCallback,
        getDatasetTextCallback,
        formatIndicatorTextCallback,
        fetchIndicatorTextCallback
    ])
    
    return (
        <>
            <QuantaDatasetManagerData.Provider value={memoValue}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </QuantaDatasetManagerData.Provider>
        </>
    )
}

export { QuantaDatasetManagerData }
export default QuantaDatasetManager