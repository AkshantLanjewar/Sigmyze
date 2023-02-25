interface IQuantaProjectData {
    dataset_name?: string,
    files?: IQuantaFile[],
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