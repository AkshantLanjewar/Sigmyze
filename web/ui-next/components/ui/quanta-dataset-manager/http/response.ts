import { IStatus } from "../../../data/datasets/DatasetsTypes";
import { IQuantaEditorProject } from "../../../data/quanta/types/project";
import { IDatasetCacheObject } from "../types";

interface IPrimeResponse {
    status?: IStatus,
    shellObject?: IDatasetCacheObject
}

interface IDatasetEditorResponse {
    status?: IStatus,
    fetchEditor?: IQuantaEditorProject,
    updateEditor?: IQuantaEditorProject
}

export type { 
    IPrimeResponse,
    IDatasetEditorResponse 
}