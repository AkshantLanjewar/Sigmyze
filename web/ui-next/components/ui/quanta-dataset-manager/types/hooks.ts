import { IDatasetProjects } from "."
import { IDatasetCard } from "../../../data/quanta/dataset-api"
import { IQuantaIndicatorLoc } from "../../../lunar-refresh/data-manager/state"
import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types"

/**
 * This is the internal structure used to track the card cache in order to maintain a timestamp
 */
interface IDatasetCardCache {
    /**
     * This is the timestamp of when the dataset cards were collected
     */
    timestamp: number,

    /**
     * This is when the dataset card entry expires
     */
    expires: number,

    /**
     * this is the cache of cards that was collected
     */
    cardCache: IDatasetCard[]
}

/**
 * This is the internal structure used to track the editor cache in order to maintain a timestamp
 */
interface IDatasetProjectCache {
    /**
     * This is the timestamp of when the data was collected
     */
    timestamp: number,

    /**
     * This is when the project cache entry expires
     */
    expires: number,

    /**
     * This is the specified dataset project that is being requested
     */
    project: IDatasetProjects
}

/**
 * This is the internal structure used to track a cached indicator
 */
interface ICachedIndicator {
    /**
     * This is the timestamp of when the data was collected
     */
    timestamp: number,

    /**
     * this is the timestamp of when the cache entry is supposed to expire
     */
    expires: number,

    /**
     * This is the indicator that has been cached
     */
    indicator: IQuantaIndicator
}

/**
 * This is the internal structure for the body of a cached query request
 */
interface ICachedQueryBody {
    /**
     * This is the timestamp of when the data was collected
     */
    timestamp: number,

    /**
     * This is the timestamp for when the query entry expires
     */
    expires: number,

    /**
     * This is the query that was used 
     * NOTE: It is stored in JSON.stringify format for standardization
     */
    query: string,

    /**
     * These are the indicators that were collected
     * NOTE: These are locations, they need to be added to the indicator cache and fetched from there
     */
    indicators: IQuantaIndicatorLoc[]
}

/**
 * This is the internal structure used to track a cached query request.
 * NOTE: The key of each field in this structure is the dataset id
 */
interface ICachedQuery {
    [datasetId: string]: ICachedQueryBody[] 
}

/**
 * This is the definition for the body in a cached length request
 */
interface ICachedLengthBody {
    /**
     * This is the timestamp of when the data was collected
     */
    timestamp: number,

    /**
     * This is the timestamp of when the entry expires
     */
    expires: number,

    /**
     * This is the query that was used 
     * NOTE: It is stored in JSON.stringify format for standardization
     */
    query: string,

    /**
     * This is the length that is cached
     */
    length: number
}

/**
 * This is the internal structure used to track a cached length request.
 * NOTE: the key of each field in this structure is the dataset id
 */
interface ICachedLength {
    [datasetId: string]: ICachedLengthBody[]
}

export type { 
    ICachedIndicator, 
    IDatasetCardCache, 
    IDatasetProjectCache, 
    ICachedQuery, 
    ICachedQueryBody,
    ICachedLength,
    ICachedLengthBody 
}