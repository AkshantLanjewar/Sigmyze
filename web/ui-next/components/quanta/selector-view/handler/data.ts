import { GetDatasetIndicatorById, GetDatasetIndicatorsPaged, SelectPagedDatasetIndicators } from "../../../data/quanta/dataset-api"
import { IQuantaCategorization } from "../../../data/quanta/types/project"
import { IQuantaIndicator } from "../../quanta-indicator-manager/types"
import { IQuantaSchema } from "../../schema-editor/types"
import { parseIncomingQuery } from "../../selector-frame/analysis"
import { buildFrameMessage } from "../../selector-frame/handler"
import { 
    IIndicatorBody, 
    IIndicatorSBody, 
    IQuantaQuery, 
    IQueryIndicator, 
    IQueryIndicatorId, 
    IQueryIndicatorPage, 
    IQueryPagedIndicators 
} from "../../selector-frame/types"

const queryIndicatorPublicHandler = async (
    data: string,
    publicToken: string | undefined,
    postMessage: (msg: string) => void,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined,
    selectIndicators: (datasetId: string, query: IQuantaQuery[]) => Promise<IQuantaIndicator[] | undefined>,
) => {
    let parsed: IQueryIndicator = JSON.parse(data)
    let query = parseIncomingQuery(parsed.query, categorization, pipelineLinks, getSchema)
    if(publicToken === undefined)
        throw Error("no_token")

    let indicators = await selectIndicators(publicToken, query)
    if(indicators === undefined)
        throw Error("no_indicators")
        
    const resolveBody: IIndicatorBody = { indicators }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

const queryIndicatorsPagePublicHandler = async (
    data: string,
    publicToken: string | undefined,
    postMessage: (msg: string) => void,
    queryIndicatorsPaged: (datasetId: string, pageLength: number, page: number) => Promise<IQuantaIndicator[] | undefined>
) => {
    let parsed: IQueryIndicatorPage = JSON.parse(data)
    if(publicToken === undefined)
        throw Error("no_token")

    let indicators = await queryIndicatorsPaged(publicToken, parsed.pageLength, parsed.page)
    if(indicators === undefined)
        throw Error("no_indicators")

    const resolveBody: IIndicatorBody = { indicators }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

const querySelectedIndicatorsPagePublicHandler = async (
    data: string,
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined,
    postMessage: (msg: string) => void,
    selectIndicatorsPaged: (datasetId: string, query: IQuantaQuery[], pageLength: number, page: number) => Promise<IQuantaIndicator[] | undefined>
) => {
    let parsed: IQueryPagedIndicators = JSON.parse(data)
    if(publicToken === undefined)
        throw Error("no_token")

    let query = parseIncomingQuery(parsed.query, categorization, pipelineLinks, getSchema)
    let indicators = await selectIndicatorsPaged(publicToken, query, parsed.pageLength, parsed.page)
    if(indicators === undefined)
        throw Error("no_indicators")

    const resolveBody: IIndicatorBody = { indicators }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

const queryIndicatorIdPublicHandler = async (
    data: string,
    publicToken: string | undefined,
    postMessage: (msg: string) => void,
    fetchIndicator: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicator | undefined>,
) => {
    let parsed: IQueryIndicatorId = JSON.parse(data)
    if(publicToken === undefined)
        throw Error("no_token")

    let indicator = await GetDatasetIndicatorById(publicToken, parsed.indicatorId)
    if(indicator === undefined)
        throw Error("no_indicator")

    const resolveBody: IIndicatorSBody = { indicator }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

export {
    queryIndicatorPublicHandler,
    queryIndicatorsPagePublicHandler,
    querySelectedIndicatorsPagePublicHandler,
    queryIndicatorIdPublicHandler
}