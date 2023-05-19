import { GetIndicatorById, GetIndicatorsPage, PageSelectedIndicators, SelectIndicator } from "../../../data/quanta/quanta-api"
import { IAuthenticationData } from "../../../data/user/types"
import { IIFrameMessage } from "../../selector-pane/selector-frame-tester/types"
import { IIndicatorBody, IIndicatorSBody, IQueryIndicator, IQueryIndicatorId, IQueryIndicatorPage, IQueryPagedIndicators, IResolverBody } from "../types"

const queryIndicatorHandler = async (
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void
) => {
    let parsed: IQueryIndicator = JSON.parse(data)
    let query = parsed.query
    let token = authData?.token

    if(token === undefined)
        throw Error("no_token")
    if(quantaId === undefined || quantaId === null)
        throw Error("no_quanta")

    let indicators = await SelectIndicator(token, quantaId, query)
    if(indicators === undefined)
        throw Error("no_indicator")

    const resolveBody: IIndicatorBody = { indicators }
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

const queryIndicatorsPage = async (
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void
) => {
    let parsed: IQueryIndicatorPage = JSON.parse(data)
    let token = authData?.token

    if(token === undefined)
        throw Error("no_token")
    if(quantaId === undefined || quantaId === null)
        throw Error("no_quanta")

    let indicators = await GetIndicatorsPage(token, quantaId, parsed.pageLength, parsed.page)
    if(indicators === undefined)
        throw Error("no_indicator")

    const resolveBody: IIndicatorBody = { indicators }
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

const querySelectedIndicatorsPage = async (
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void
) => {
    let parsed: IQueryPagedIndicators = JSON.parse(data)
    let token = authData?.token

    if(token === undefined)
        throw Error("no_token")
    if(quantaId === undefined || quantaId === null)
        throw Error("no_quanta")

    let indicators = await PageSelectedIndicators(token, quantaId, parsed.pageLength, parsed.page, parsed.query)
    if(indicators === undefined)
        throw Error("no_indicator")

    const resolveBody: IIndicatorBody = { indicators }
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

const queryIndicatorId = async (
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void
) => {
    let parsed: IQueryIndicatorId = JSON.parse(data)
    let token = authData?.token

    if(token === undefined)
        throw Error("no_token")
    if(quantaId === undefined || quantaId === null)
        throw Error("no_quanta")

    let indicator = await GetIndicatorById(token, quantaId, parsed.indicatorId)
    if(indicator === undefined)
        throw Error("no_indicator")

    const resolveBody: IIndicatorSBody = { indicator }
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

export { 
    queryIndicatorHandler,
    queryIndicatorsPage,
    querySelectedIndicatorsPage,
    queryIndicatorId 
}