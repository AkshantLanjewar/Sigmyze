import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore } from "../../../data/quanta/types/project"
import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types";

//this is all the data that we cache, and is required to run the bare minimum of public UI without having to request for indicators
interface IDatasetCache {
    [key: string]: IDatasetCacheObject
}

interface IDatasetCacheObject {
    //used for feeding categories into a selector
    categorization: IQuantaCategorization;
    //name of the dataset, display purposes
    dataset_name: string;
    //id of the dataset, display purposes
    dataset_id: string;
    //description of the dataset, used in public pages
    dataset_description: string;
    //selectors, used when fetching indicators from this specific dataset
    selectors: IQuantaSelector[];
    //stores data relating to the formatters
    textStore: IQuantaTextStore;
}

interface IQuantaIndicatorShell {
    datasetId: string,
    indicatorId: string
}

interface IQuantaIndicatorCache {
    [key: string]: IQuantaIndicator[]
}

interface IQuantaIndicatorText {
    title: string,
    short: string
}

export type { 
    IDatasetCache,
    IDatasetCacheObject,
    IQuantaIndicatorShell,
    IQuantaIndicatorCache,
    IQuantaIndicatorText 
}