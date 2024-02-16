import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { IDatasetCache, IDatasetCacheObject, IDatasetProjects } from "../types"
import { GET_Cacheless, GenerateOptions, server } from "../../../data/utils"
import { IDatasetEditorResponse, IPrimeResponse } from "../http"
import { showNotification } from "@mantine/notifications"
import { GetPublicDatasets } from "../../../data/quanta/dataset-api"
import { IDatasetProjectCache, IDatasetCardCache } from "../types/hooks"

/**
 * NOTE: This is an internal function only
 * @description
 *  - this is a function that validates whether or not a dataset cache object is valid
 */
const validateShellObject = (shellObject: IDatasetCacheObject) => {
    if(shellObject.timestamp === undefined || shellObject.expire === undefined)
        return false

    //calculate the date
    const day = shellObject.expire
    return shellObject.timestamp < day
}

/**
 * @description
 *  - this is the function to prime a dataset using caching logic
 * @param datasetId 
 *  - this is the id of the dataset we are trying to prime
 * @param datasetCache 
 *  - this is the dataset prime data cache
 * @param setDCU
 *  - set state used to notify whether or not the dataset cache has updated in size
 */
const primeDatasetCache = async (
    datasetId: string,
    datasetCache: MutableRefObject<IDatasetCache>,
    setDCU: Dispatch<SetStateAction<boolean>>
) => {
    //before we do any fetching, we are going to check if it is already within the cache
    let cacheKeys = Object.keys(datasetCache.current)
    if(cacheKeys.includes(datasetId)) {
        let shellObject = datasetCache.current[datasetId]
        if(validateShellObject(shellObject) === true)
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

    //now we update the dataset cache
    const day = 1000 * 60 * 60 * 16
    resp.shellObject.timestamp = Date.now()
    resp.shellObject.expire = resp.shellObject.timestamp + day

    datasetCache.current[datasetId] = resp.shellObject
    setDCU((step) => !step)
    return resp.shellObject
}

/**
 * @description
 *  - this is the function that fetch's a dataset's node editors
 * @param datasetId 
 *  - this is the id of the dataset being requested
 * @param datasetEditorCache 
 *  - this is the cache of stored node editor data
 */
const fetchDatasetEditorCache = async (
    datasetId: string,
    datasetEditorCache: MutableRefObject<IDatasetProjectCache[]>,
    setDEU: Dispatch<SetStateAction<boolean>>
) => {
    //first we go through and check to see if there is a valid cache entry
    let prevIndex: number | undefined = undefined
    for(let i = 0; i < datasetEditorCache.current.length; i++) {
        let editorProject = datasetEditorCache.current[i]
        if(editorProject.project.datasetId === datasetId) {
            //now we have to calcualte whether or not this entry is stale
            let timestamp = editorProject.timestamp
            let expires = editorProject.expires

            prevIndex = i
            if(timestamp < expires)
                return editorProject.project
        }
    }

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

    let timestamp = Date.now()
    let project: IDatasetProjects = {
        datasetId: datasetId,
        fetchEditor: response.fetchEditor,
        updateEditor: response.updateEditor
    }

    const day = 1000 * 60 * 60 * 8
    const expires = Date.now() + day

    if(prevIndex !== undefined)
        datasetEditorCache.current[prevIndex] = { timestamp, project, expires }
    else {
        datasetEditorCache.current.push({ timestamp, project, expires })
        setDEU((step) => !step)
    }

    return project
}

/**
 * @description
 *  - this is the function that gets the dataset selectors using a cache
 * @param datasetId 
 *  - this is the id of the dataset we are fetching
 * @param datasetCache 
 *  - this is the cache of primed dataset data
 * @param setDCU
 *  - set state used to notify whether or not the dataset cache has updated in size
 */
const getDatasetSelectorsCache = async (
    datasetId: string,
    datasetCache: MutableRefObject<IDatasetCache>,
    setDCU: Dispatch<SetStateAction<boolean>>
) => {
    let cacheObj = await primeDatasetCache(datasetId, datasetCache, setDCU)
    return cacheObj?.selectors
}

/**
 * @description
 *  - this is the function that gets a dataets's categorization
 * @param datasetId
 *  - this is the id of the dataset of which we want their categorization
 * @param datasetCache
 *  - this is the cache of the primed dataset data
 * @param setDCU
 *  - set state used to notify whether or not the dataset cache has updated in size
 */
const getDatasetCategorizationCache = async (
    datasetId: string,
    datasetCache: MutableRefObject<IDatasetCache>,
    setDCU: Dispatch<SetStateAction<boolean>>
) => {
    let cacheObj = await primeDatasetCache(datasetId, datasetCache, setDCU)
    return cacheObj?.categorization
}

/**
 * @description
 *  - this is the function that retreives a text field from a primed dataset
 * @param datasetId
 *  - this is the id of the dataset of which we want their text field
 * @param type
 *  - this is the text field we want from the dataset
 * @param datasetCache
 *  - this is the cache of the primed dataset data
 * @param setDCU
 *  - set state used to notify whether or not the dataset cache has updated in size
 */
const getDatasetTextCache = async (
    datasetId: string,
    type: string,
    datasetCache: MutableRefObject<IDatasetCache>,
    setDCU: Dispatch<SetStateAction<boolean>>
) => {
    let cacheObj = await primeDatasetCache(datasetId, datasetCache, setDCU)
    switch (type) {
        case "name":
            return cacheObj?.dataset_name
        case "id":
            return cacheObj?.dataset_id
        case "description":
            return cacheObj?.dataset_description
        default:
            return undefined
    }
}

/**
 * @description
 *  - this is the function that gets all the public dataset cards
 * @param datasetCardCache 
 *  - this is the current cache of dataset cards
 */
const getPublicDatasetCardsCache = async ( datasetCardCache: MutableRefObject<IDatasetCardCache | null> ) => {
    //first we want to check if there is an entry in the cache before we fetch a fresh set of cards
    if(datasetCardCache.current !== null) {
        let timestamp = datasetCardCache.current.timestamp
        let expires = datasetCardCache.current.expires

        if(timestamp < expires)
            return datasetCardCache.current.cardCache
    }

    //otherwise we need to fetch a fresh set of dataset cards
    let datasetCards = await GetPublicDatasets()
    if(datasetCards === undefined)
        return

    const day = 1000 * 60 * 60 * 8
    let timestamp = Date.now()
    const expires = timestamp + day

    let newCache: IDatasetCardCache = { timestamp, cardCache: datasetCards, expires }
    datasetCardCache.current = newCache
    return datasetCards
}

export { 
    primeDatasetCache, 
    fetchDatasetEditorCache,
    getDatasetSelectorsCache,
    getDatasetCategorizationCache,
    getDatasetTextCache,
    getPublicDatasetCardsCache 
}