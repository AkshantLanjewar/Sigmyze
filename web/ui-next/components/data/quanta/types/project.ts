interface IQuantaProjectData {
    /**
     * This is the name of the dataset
     */
    dataset_name?: string,

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