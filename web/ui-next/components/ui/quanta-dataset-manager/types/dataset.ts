import { IQuantaCategorization, IQuantaEditorProject, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../../data/quanta/types/project"
import { IQuantaIndicator } from "../../../quanta/quanta-indicator-manager/types";

//this is all the data that we cache, and is required to run the bare minimum of public UI without having to request for indicators
interface IDatasetCache {
    [key: string]: IDatasetCacheObject
}

interface IDatasetCacheObject {
    //used for feeding categories into a selector
    categorization?: IQuantaCategorization; //added
    //name of the dataset, display purposes
    dataset_name?: string;
    //id of the dataset, display purposes
    dataset_id?: string;
    //description of the dataset, used in public pages
    dataset_description?: string;
    //selectors, used when fetching indicators from this specific dataset
    selectors?: IQuantaSelector[]; //added
    //stores data relating to the formatters
    textStore?: IQuantaTextStore; //added
    //schemas for the dataset
    schemas?: ProjectSchemas[] //added
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

interface IDatasetProjects {
    //id for the dataset
    datasetId: string,
    //fetch editor data
    fetchEditor: IQuantaEditorProject,
    //update editor data
    updateEditor: IQuantaEditorProject
}

export type { 
    IDatasetCache,
    IDatasetCacheObject,
    IQuantaIndicatorShell,
    IQuantaIndicatorCache,
    IQuantaIndicatorText,
    IDatasetProjects 
}