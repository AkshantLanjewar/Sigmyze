import { showNotification } from "@mantine/notifications"
import { IStatus } from "../datasets/DatasetsTypes"
import { GET_Cacheless, GenerateOptions, server } from "../utils"

interface IPublishDatasetPOST {
    title: string,
    datasetId: string,
    description: string,
    public: boolean,
    quantaId: string,
    organizationId: string,
    publicToken?: string
}

async function PublishDataset(token: string, data: IPublishDatasetPOST) {
    let url = `${server}/api/v2/dataset/publish/new`
    let options = GenerateOptions("POST", token, data)
    let resp = await GET_Cacheless<IStatus>(url, options)

    if(resp.error === true)
        showNotification({
            title: "Publishing Error",
            message: `Server Error, unable to publish dataset because -> ${resp.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })
}

async function IsPublished(token: string, quantaId: string) {
    let url = `${server}/api/v2/dataset/publish/published/${quantaId}`
    let options = GenerateOptions("GET", token)
    let resp = await GET_Cacheless<IStatus>(url, options)

    return resp.error
}

interface IUnpublishDatasetPOST {
    organizationId: string,
    quantaId: string
}

async function UnpublishDataset(token: string, data: IUnpublishDatasetPOST) {
    let url = `${server}/api/v2/dataset/publish/unpublish`
    let options = GenerateOptions("POST", token, data)
    let resp = await GET_Cacheless<IStatus>(url, options)

    if(resp.error === true)
        showNotification({
            title: "Publishing Error",
            message: `Server Error, unable to publish dataset because -> ${resp.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

}

async function IsPublic(datasetId: string) {
    let url = `${server}/api/v2/dataset/published/${datasetId}/is_public`
    let options = GenerateOptions("GET", null)
    let resp = await GET_Cacheless<IStatus>(url, options)

    return resp.error
}

async function IsDatasetAuthorized(token: string, datasetId: string) {
    let url = `${server}/api/v2/dataset/published/${datasetId}/authorized`
    let optoins = GenerateOptions("GET", token)
    let resp = await GET_Cacheless<IStatus>(url, optoins)

    return resp.error
}

export type { 
    IPublishDatasetPOST,
    IUnpublishDatasetPOST 
}

export { 
    PublishDataset,
    IsPublished,
    UnpublishDataset,
    IsPublic,
    IsDatasetAuthorized
}