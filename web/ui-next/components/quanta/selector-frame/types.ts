import { IQuantaIndicator } from "../quanta-indicator-manager/types"
import { IPipelineAnalysis } from "../selector-pane/context/types"

interface IQueryIndicator {
    requestId: string,
    query: IQuantaQuery[]
}

interface IQueryIndicatorId {
    requestId: string,
    indicatorId: string
}

interface IQueryIndicatorPage {
    requestId: string,
    page: number,
    pageLength: number
}

interface IQueryPagedIndicators {
    requestId: string,
    page: number,
    pageLength: number,
    query: IQuantaQuery[]
}

interface IQuantaQuery {
    fieldKey?: string,
    fieldType?: string,
    stringField?: string,
    dateField?: number,
    multiValue?: boolean,
    stringFields?: string[],
    dateFields?: number[]
}

interface IResolverBody{
    requestId?: string,
    requestData?: string
}

interface IIndicatorBody {
    indicators?: IQuantaIndicator[]
}

interface IIndicatorSBody {
    indicator?: IQuantaIndicator
}

interface IIndicatorLengthResponse {
    length?: number
}

interface IPipelineMessage {
    analysis: IPipelineAnalysis[]
}

export type { 
    IQueryIndicator, 
    IQuantaQuery,
    IResolverBody,
    IIndicatorBody,
    IPipelineMessage,
    IQueryIndicatorPage,
    IQueryPagedIndicators,
    IIndicatorLengthResponse,
    IQueryIndicatorId,
    IIndicatorSBody 
}