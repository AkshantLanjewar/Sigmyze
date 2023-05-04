import { IQuantaIndicator } from "../quanta-indicator-manager/types"
import { IPipelineAnalysis } from "../selector-pane/context/types"

interface IQueryIndicator {
    requestId: string,
    query: IQuantaQuery[]
}

interface IQueryIndicatorPage {
    requestId: string,
    page: number,
    pageLength: number
}

interface IQuantaQuery {
    fieldKey?: string,
    fieldType?: string,
    stringField?: string,
    dateField?: number
}

interface IResolverBody{
    requestId?: string,
    requestData?: string
}

interface IIndicatorBody {
    indicators?: IQuantaIndicator[]
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
    IQueryIndicatorPage 
}