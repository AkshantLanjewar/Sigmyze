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
    store?: IQuantaDataStore
}

interface IQuantaFile {
    name?: string,
    type?: string,
    id?: string
}

interface IQuantaDataStore {

}

export type { 
    IQuantaProjectData,
    IQuantaFile,
    IQuantaDataStore 
}