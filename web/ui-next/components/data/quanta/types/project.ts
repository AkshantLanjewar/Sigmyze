import { IQuantaSchema } from "../../../quanta/schema-editor/types"

interface IQuantaProjectData {
    /**
     * This is the name of the dataset
     */
    dataset_name?: string,

    /**
     * This is the id for the dataset
     */
    dataset_id?: string,

    /**
     * this is the description for the dataset
     */
    dataset_description?: string,

    /**
     * Different file components in the dataset
     */
    files?: IQuantaFile[],

    /**
     * Store where all the data and configs are stored
     */
    store?: IQuantaDataStore,

    /**
     * this is the schema for the dataset
     */
    dataset_schema?: IQuantaSchema
}

interface IQuantaFile {
    name?: string,
    type?: string,
    id?: string
}

interface IQuantaDataStore {
    selectors: IQuantaSelector[]
}


interface IQuantaSelector {
    selectorId?: string,
    selectorName?: string,
    selectorDescription?: string
}

export type { 
    IQuantaProjectData,
    IQuantaFile,
    IQuantaDataStore,
    IQuantaSelector 
}