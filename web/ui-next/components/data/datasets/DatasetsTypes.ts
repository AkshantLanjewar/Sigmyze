interface IStatus {
    error: boolean,
    msg: string
}

interface IDataset {
    name: string,
    logo: string
}

interface IDatasetObject {
    object_id: string,
    object_fullname: string,
    object_logo: string,

    active?: boolean
}

interface IObjectIndicator {
    indicator_id: string,
    indicator_fullname: string,
    category: string
}

interface IIndicator {
    dataset: string,
    object: IDatasetObject,
    indicator: IObjectIndicator
}

interface IIndicatorData {
    year?: string,
    value?: number | string,
    projection?: boolean
}

interface IDatasetIndicator {
    indicator_id?: string,
    indicator_units?: string,
    indicator_name?: string,
    indicator_category?: string,
    indicator_data?: Array<IIndicatorData>
}

interface IUnparsedIndicator {
    indicator: IIndicator
    indicator_data: Array<IIndicatorData>
}

interface IDatasetsResponse {
    status: IStatus,
    datasets: Array<IDataset>
}

interface IDatasetsObjectsResponse {
    status: IStatus,
    objects: Array<IDatasetObject>
}

interface IDatasetsCategoriesResponse {
    status: IStatus,
    categories: Array<string>
}

interface IDatasetsIndicatorsResponse {
    status: IStatus,
    indicators: Array<IObjectIndicator>
}

interface IDatasetsIndicatorResponse {
    status: IStatus,
    indicator: IDatasetIndicator
}

export type { 
    IDataset,
    IDatasetObject,
    IObjectIndicator,
    IIndicator,
    IDatasetsResponse,
    IDatasetsObjectsResponse,
    IDatasetsCategoriesResponse,
    IDatasetsIndicatorsResponse,
    IDatasetsIndicatorResponse,
    IUnparsedIndicator,
    IIndicatorData 
}