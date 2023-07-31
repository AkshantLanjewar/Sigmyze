import { DatasetIndicatorsLength, SelectDatasetIndicatorsLength } from "../../../data/quanta/dataset-api"
import { IQuantaCategorization } from "../../../data/quanta/types/project"
import { IQuantaSchema } from "../../schema-editor/types"
import { parseIncomingQuery } from "../../selector-frame/analysis"
import { buildFrameMessage } from "../../selector-frame/handler"
import { IIndicatorLengthResponse, IQueryIndicator } from "../../selector-frame/types"

const queryIndicatorsLengthPublic = async (
    data: string,
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined,
    postMessage: (msg: string) => void,
) => {
    if(publicToken === undefined)
        throw Error("no_token")

    let parsed: IQueryIndicator = JSON.parse(data)
    let query = parseIncomingQuery(parsed.query, categorization, pipelineLinks, getSchema)
    let length = await SelectDatasetIndicatorsLength(publicToken, query)
    if(length === undefined)
        length = 0

    const resolveBody: IIndicatorLengthResponse = { length }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

const indicatorsLengthPublic = async (
    data: string,
    publicToken: string | undefined,
    postMessage: (msg: string) => void
) => {
    let parsed: IQueryIndicator = JSON.parse(data)
    if(publicToken === undefined)
        throw Error("no_token")

    let length = await DatasetIndicatorsLength(publicToken)
    if(length === undefined)
        length = 0

    const resolveBody: IIndicatorLengthResponse = { length }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

export { 
    queryIndicatorsLengthPublic,
    indicatorsLengthPublic 
}