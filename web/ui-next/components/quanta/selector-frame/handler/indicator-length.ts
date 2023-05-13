import { IndicatorsLength, SelectIndicatorsLength } from "../../../data/quanta/quanta-indicator-api";
import { IQuantaCategorization } from "../../../data/quanta/types/project";
import { IAuthenticationData } from "../../../data/user/types";
import { IQuantaSchema } from "../../schema-editor/types";
import { IIFrameMessage } from "../../selector-pane/selector-frame-tester/types";
import { parseIncomingQuery } from "../analysis";
import { IIndicatorLengthResponse, IQueryIndicator, IResolverBody } from "../types";

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

    console.log(query)
    query = parseIncomingQuery(query, categorization, pipelineLinks, getSchema)
    console.log(query)
    
    let length = await SelectIndicatorsLength(token, quantaId, query)
    if(length === undefined)
        throw Error("no_length")

    console.log(length)
    const resolveBody: IIndicatorLengthResponse = { length }
    const resolverBody: IResolverBody = {
        requestId: parsed.requestId,
        requestData: JSON.stringify(resolveBody)
    }

    const frameMessage: IIFrameMessage = {
        function: "queryIndicator",
        data: JSON.stringify(resolverBody)
    }

    postMessage(JSON.stringify(frameMessage))
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
    const resolverBody: IResolverBody = {
        requestId: parsed.requestId,
        requestData: JSON.stringify(resolveBody)
    }

    const frameMessage: IIFrameMessage = {
        function: "queryIndicator",
        data: JSON.stringify(resolverBody)
    }

    postMessage(JSON.stringify(frameMessage))
}

export { queryIndicatorLength, indicatorsLength }