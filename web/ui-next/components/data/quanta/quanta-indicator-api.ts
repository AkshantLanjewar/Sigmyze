import { showNotification } from "@mantine/notifications"
import { IQuantaIndicator } from "../../quanta/quanta-indicator-manager/types"
import { IQuantaQuery } from "../../quanta/selector-frame/types"
import { IStatus } from "../datasets/DatasetsTypes"
import { server, GenerateOptions, GET } from "../utils"

interface IQuantaIndicatorsResp {
    status?: IStatus,
    indicators?: IQuantaIndicator[]
}

async function GetQuantaIndicators(token: string, organization_id: string, project_id: string) {
    let url = `${server}/api/v2/quanta/${organization_id}/${project_id}/indicators`
    let options = GenerateOptions("GET", token) 
    let resp = await GET<IQuantaIndicatorsResp>(url, options)

    let indicators = resp.indicators
    if(indicators === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicators because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return indicators
}

async function SelectIndicator(token: string, quantaId: string, params: IQuantaQuery[]) {
    const body = {
        params: params,
        quantaId: quantaId
    }

    let url = `${server}/api/v2/quanta/select/indicator`
    let options = GenerateOptions("POST", token, body)
    let resp = await GET<IQuantaIndicatorsResp>(url, options)

    let indicators = resp.indicators
    if(indicators === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicators because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return indicators
}

async function PageSelectedIndicators(token: string, quantaId: string, pageLength: number, page: number, params: IQuantaQuery[]) {
    const body = {
        params: params,
        quantaId: quantaId
    }

    let url = `${server}/api/v2/quanta/select/indicator/${pageLength}/${page}`
    let options = GenerateOptions("POST", token, body)
    let resp = await GET<IQuantaIndicatorsResp>(url, options)

    let indicators = resp.indicators
    if(indicators === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicators because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return indicators
}

async function GetIndicatorsPage(token: string, quantaId: string, pageLength: number, page: number) {
    let url = `${server}/api/v2/quanta/${quantaId}/${pageLength}/indicators/${page}`
    let options = GenerateOptions("GET", token)
    let resp = await GET<IQuantaIndicatorsResp>(url, options)

    let indicators = resp.indicators
    if(indicators === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicators because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return indicators
}

interface IGetIndicatorsLength {
    status?: IStatus,
    length?: number
}

async function SelectIndicatorsLength(token: string, quantaId: string, params: IQuantaQuery[]) {
    const body = {
        params: params,
        quantaId: quantaId
    }

    let url = `${server}/api/v2/quanta/select/indicator_length`
    let options = GenerateOptions("POST", token, body)
    let resp = await GET<IGetIndicatorsLength>(url, options)

    let length = resp.length
    if(length === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicators because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return length
}

async function IndicatorsLength(token: string, quantaId: string) {
    let url = `${server}/api/v2/quanta/${quantaId}/indicators_length`
    let options = GenerateOptions("GET", token)
    let resp = await GET<IGetIndicatorsLength>(url, options)

    let length = resp.length
    if(length === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicators because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return length
}

interface IQuantaIndicatorResp {
    status?: IStatus,
    indicator?: IQuantaIndicator
}

async function GetIndicatorById(token: string, quantaId: string, indicatorId: string) {
    let url = `${server}/api/v2/quanta/select/indicator/${quantaId}/${indicatorId}`
    let options = GenerateOptions("GET", token)
    let resp = await GET<IQuantaIndicatorResp>(url, options)

    let indicator = resp.indicator
    if(indicator === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicator because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return
    }

    return indicator
}

export {
    GetQuantaIndicators,
    SelectIndicator,
    PageSelectedIndicators,
    SelectIndicatorsLength,
    IndicatorsLength,
    GetIndicatorsPage,
    GetIndicatorById 
}