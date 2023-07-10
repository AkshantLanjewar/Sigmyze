import { showNotification } from "@mantine/notifications"
import { GET_Cacheless, GenerateOptions, server } from "../utils"
import { IGetIndicatorsLength, IQuantaIndicatorResp, IQuantaIndicatorsResp } from "./quanta-indicator-api"
import { IQuantaQuery } from "../../quanta/selector-frame/types"
import { IStatus } from "../datasets/DatasetsTypes"

async function GetDatasetIndicators(token: string) {
    let url = `${server}/api/v2/dataset/${token}/indicators`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<IQuantaIndicatorsResp>(url, options)

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

async function GetDatasetIndicatorsPaged(token: string, pageLength: number, page: number) {
    let url = `${server}/api/v2/dataset/${token}/${pageLength}/indicators/${page}`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<IQuantaIndicatorsResp>(url, options)

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

async function DatasetIndicatorsLength(token: string) {
    let url = `${server}/api/v2/dataset/${token}/indicators_length`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<IGetIndicatorsLength>(url, options)

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

async function SelectDatasetIndicatorsLength(token: string, params: IQuantaQuery[]) {
    const body = {
        params: params,
        token: token
    }

    let url = `${server}/api/v2/dataset/select/indicator_length`
    let options = GenerateOptions("POST", null, body)
    let resp = await GET_Cacheless<IGetIndicatorsLength>(url, options)

    let length = resp.length
    if(length === undefined || resp.status?.error === true) {
        if(resp.status?.msg === "quanta_not_found")
            return

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

async function SelectDatasetIndicator(token: string, params: IQuantaQuery[]) {
    const body = {
        params: params,
        token: token
    }

    let url = `${server}/api/v2/dataset/select/indicator`
    let options = GenerateOptions("POST", null, body)
    let resp = await GET_Cacheless<IQuantaIndicatorsResp>(url, options)

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

async function SelectPagedDatasetIndicators(token: string, params: IQuantaQuery[], pageLength: number, page: number) {
    const body = {
        params: params,
        token: token
    }

    let url = `${server}/api/v2/dataset/select/indicator/${pageLength}/${page}`
    let options = GenerateOptions("POST", null, body)
    let resp = await GET_Cacheless<IQuantaIndicatorsResp>(url, options)

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

async function GetDatasetIndicatorById(token: string, indicatorId: string) {
    let url = `${server}/api/v2/dataset/select/indicator/${token}/${indicatorId}`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<IQuantaIndicatorResp>(url, options)

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

//NOTE: Mapping functions
interface ICreateMappingResponse {
    status: IStatus,
    token?: string
}

async function CreateQuantaMapping(quantaId: string) {
    let url = `${server}/api/v2/dataset/map/create/${quantaId}`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<ICreateMappingResponse>(url, options)

    let token = resp.token
    if(token === undefined || resp.status.msg === "mapping_exists") {
        token = await GetQuantaMapping(quantaId)
    }

    return token
}

async function DeleteQuantaMapping(token: string) {
    let url = `${server}/api/v2/dataset/map/delete/${token}`
    let options = GenerateOptions("GET", null)
    await GET_Cacheless<IStatus>(url, options)
}

async function GetQuantaMapping(quantaId: string) {
    let url = `${server}/api/v2/dataset/map/get/${quantaId}`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<ICreateMappingResponse>(url, options)

    if(resp.token === undefined || resp.status.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive token because -> ${resp.status.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return resp.token
}

export {
    GetDatasetIndicators,
    GetDatasetIndicatorsPaged,
    DatasetIndicatorsLength,
    SelectDatasetIndicatorsLength,
    SelectDatasetIndicator,
    SelectPagedDatasetIndicators,
    GetDatasetIndicatorById,
    CreateQuantaMapping,
    DeleteQuantaMapping,
    GetQuantaMapping
}