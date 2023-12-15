import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { IQuantaQuery } from "../../../quanta/selector-frame/types"
import { DatasetIndicatorsLength, SelectDatasetIndicatorsLength } from "../../../data/quanta/dataset-api"
import { ICachedLength, ICachedLengthBody } from "../types/hooks"

interface IGetQueryLengthFormat {
    bodyIndex: number | undefined,
    length: number | undefined
}

/**
 * @description
 *  - this is the utility function that checks if there is a query already within the cache
 * @param datasetId 
 *  - this is the dataset where we are executing the query
 * @param query 
 *  - this is the string based query, used to match up the objects in the cache
 * @param lengthCache 
 *  - this is the cache of length queries that have been executed
 */
const getQueryLength = (
    datasetId: string,
    query: string,
    lengthCache: MutableRefObject<ICachedLength>
): IGetQueryLengthFormat => {
    let queryKeys = Object.keys(datasetId)
    if(queryKeys.includes(datasetId) === false) {
        lengthCache.current[datasetId] = []
        return { bodyIndex: undefined, length: undefined }
    }

    let body: ICachedLengthBody | undefined = undefined
    let bodyIndex: number | undefined = undefined
    for(let i = 0; i < lengthCache.current[datasetId].length; i++) {
        let _body = lengthCache.current[datasetId][i]
        if(_body.query === query) {
            body = _body
            bodyIndex = i
        }
    }

    if(body === undefined)
        return { bodyIndex, length: undefined }

    let timestamp = body.timestamp
    const day = 1000 * 60 * 60 * 8
    const dayAgo = Date.now() - day

    if(timestamp > dayAgo)
        return { bodyIndex, length: undefined }

    return {
        bodyIndex,
        length: body.length
    }
}

/**
 * @description
 *  - this is the function that gets the amount of indicators returned from a query
 * @param datasetId
 *  - this is the dataset we are executing the query in
 * @param query
 *  - this is the query we are executing on the dataset
 * @param lengthCache
 *  - this is the current cache of length requests
 */
const queryIndicatorsLengthCache = async (
    datasetId: string,
    query: IQuantaQuery[],
    lengthCache: MutableRefObject<ICachedLength>,
    setLCU: Dispatch<SetStateAction<boolean>>
) => {
    //convert query into string
    const querySTR = JSON.stringify(query)

    //first we need to go through and figure out whether or not we have a valid cache entry
    let potentialBody = getQueryLength(datasetId, querySTR, lengthCache)
    let bodyIndex = potentialBody.bodyIndex
    if(potentialBody.length !== undefined)
        return potentialBody.length

    //noow we have to make an actual length request
    let length = await SelectDatasetIndicatorsLength(datasetId, query)
    if(length === undefined)
        return

    let newBody: ICachedLengthBody = {
        timestamp: Date.now(),
        query: querySTR,
        length: length
    }

    if(bodyIndex === undefined) {
        lengthCache.current[datasetId].push(newBody)
        setLCU((step) => !step)
    } else
        lengthCache.current[datasetId][bodyIndex] = newBody

    return length
}

const indicatorsLengthCache = async (
    datasetId: string,
    lengthCache: MutableRefObject<ICachedLength>,
    setLCU: Dispatch<SetStateAction<boolean>>
) => {
    const querySTR = "base::id"

    //first we need to go through and figure out whether or not we have a valid cache entry
    let potentialBody = getQueryLength(datasetId, querySTR, lengthCache)
    let bodyIndex = potentialBody.bodyIndex
    if(potentialBody.length !== undefined)
        return potentialBody.length

    let length = await DatasetIndicatorsLength(datasetId)
    if(length === undefined)
        return

    let newBody: ICachedLengthBody = {
        timestamp: Date.now(),
        query: querySTR,
        length: length
    }

    if(bodyIndex === undefined){
        lengthCache.current[datasetId].push(newBody)
        setLCU((step) => !step)
    } else
        lengthCache.current[datasetId][bodyIndex] = newBody

    return length
}

export { queryIndicatorsLengthCache, indicatorsLengthCache }