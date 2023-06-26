import { IndicatorsLength, SelectIndicatorsLength } from "../../../data/quanta/quanta-indicator-api";
import { IQuantaCategorization } from "../../../data/quanta/types/project";
import { IAuthenticationData } from "../../../data/user/types";
import { IQuantaSchema } from "../../schema-editor/types";
import { IIFrameMessage } from "../../selector-pane/selector-frame-tester/types";
import { parseIncomingQuery } from "../analysis";
import { IIndicatorLengthResponse, IQueryIndicator, IResolverBody } from "../types";
import { buildFrameMessage } from "./utils";

const queryIndicatorLength = async (
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined
) => {
    let parsed: IQueryIndicator = JSON.parse(data)
    let query = parsed.query
    let token = authData?.token

    if(token === undefined)
        throw Error("no_token")
    if(quantaId === undefined || quantaId === null)
        throw Error("no_quanta")

    query = parseIncomingQuery(query, categorization, pipelineLinks, getSchema)
    let length = await SelectIndicatorsLength(token, quantaId, query)
    if(length === undefined)
        length = 0
    
    const resolveBody: IIndicatorLengthResponse = { length }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

const indicatorsLength = async (
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void
) => {
    let parsed: IQueryIndicator = JSON.parse(data)
    let token = authData?.token

    if(token === undefined)
        throw Error("no_token")
    if(quantaId === undefined || quantaId === null)
        throw Error("no_quanta")

    let length = await IndicatorsLength(token, quantaId)
    if(length === undefined)
        throw Error("no_length")

    const resolveBody: IIndicatorLengthResponse = { length }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

export { queryIndicatorLength, indicatorsLength }