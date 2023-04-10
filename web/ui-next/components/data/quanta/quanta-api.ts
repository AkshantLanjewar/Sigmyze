import { showNotification } from "@mantine/notifications"
import { IStatus } from "../datasets/DatasetsTypes"
import { GET_Cacheless, GenerateOptions, removeEmpty, server } from "../utils"
import { IQuantaProjectData } from "./types/project"
import { IQuantaIndicator } from "../../quanta/quanta-indicator-manager/types"

interface IProjectDataResponse {
    project_id?: string,
    project_name?: string,
    project_data?: IQuantaProjectData
}   

interface GetProjectResponse {
    status: IStatus,
    project_data?: IProjectDataResponse
}

async function GetProject(token: string, organization_id: string, project_id: string) : Promise<IProjectDataResponse | undefined> {
    let url = `${server}/api/v2/quanta/${organization_id}/${project_id}`
    let options = GenerateOptions("GET", token)
    let resp = await GET_Cacheless<GetProjectResponse>(url, options)

    if(resp.status.error === true || resp.project_data === undefined) {
        showNotification({
            title: "Verify Error",
            message: "Unfortunately, you are not authorized to access this project",
            color: 'red',
            autoClose: 1000 * 10
        })
        
        setTimeout(() => {
            window.location.replace('/lunar')
        }, 1000 * 3)
        return
    }

    return removeEmpty(resp.project_data)
}

async function UpdateProject(token: string, organization_id: string, project_id: string, data: IQuantaProjectData) {
    let body = {
        data: data
    }
    
    let url = `${server}/api/v2/quanta/${organization_id}/${project_id}`
    let options = GenerateOptions("POST", token, body)
    await GET_Cacheless(url, options)
}

async function CreateExecutionCache(token: string, organization_id: string, project_id: string, process_id: string) {
    let url = `${server}/api/v2/quanta/${organization_id}/${project_id}/cache/create/${process_id}`
    let options = GenerateOptions("GET", token)
    let resp = await GET_Cacheless<IStatus>(url, options)

    if(resp.error === true) {
        showNotification({
            title: "Execution Error",
            message: "Server Error, unable to create execution cache",
            color: 'red',
            autoClose: 1000 * 10
        })

        return false
    }

    return true
}

async function DeleteExecutionCache(token: string, organization_id: string, project_id: string, process_id: string) {
    let url = `${server}/api/v2/quanta/${organization_id}/${project_id}/cache/delete/${process_id}`
    let options = GenerateOptions("GET", token)
    let resp = await GET_Cacheless<IStatus>(url, options)

    if(resp.error === true) {
        showNotification({
            title: "Execution Error",
            message: "Server Error, unable to delete execution cache",
            color: 'red',
            autoClose: 1000 * 10
        })

        return false
    }

    return true
}

interface IQuantaIndicatorsResp {
    status?: IStatus,
    indicators?: IQuantaIndicator[]
}

async function GetQuantaIndicators(token: string, organization_id: string, project_id: string) {
    let url = `${server}/api/v2/quanta/${organization_id}/${project_id}/indicators`
    let options = GenerateOptions("GET", token) 
    let resp = await GET_Cacheless<IQuantaIndicatorsResp>(url, options)

    let indicators = resp.indicators
    if(indicators === undefined || resp.status?.error === true) {
        showNotification({
            title: "Indicator Error",
            message: `Server Error, unable to retreive indicatores because -> ${resp.status?.msg}`,
            color: 'red',
            autoClose: 1000 * 10
        })

        return undefined
    }

    return indicators
}

export type { IProjectDataResponse }
export { 
    GetProject, 
    UpdateProject,
    CreateExecutionCache,
    DeleteExecutionCache,
    GetQuantaIndicators 
}