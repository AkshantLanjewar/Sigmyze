import { IStatus } from "../../../data/datasets/DatasetsTypes";
import { IDatasetCacheObject } from "../types";

interface IPrimeResponse {
    status?: IStatus,
    shellObject?: IDatasetCacheObject
}

export type { IPrimeResponse }