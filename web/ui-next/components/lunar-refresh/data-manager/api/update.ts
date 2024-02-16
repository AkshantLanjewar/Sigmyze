import { IStatus } from "../../../data/datasets/DatasetsTypes"
import { GET_Cacheless, GenerateOptions, server } from "../../../data/utils"
import { ISimpleFilesystem } from "../../../ui/file-management/types"
import { ILunarChart, ILunarNote } from "../state"
import { ILunarUpdateChartsBody, ILunarUpdateFiletreeBody, ILunarUpdateNameBody, ILunarUpdateNotesBody } from "./types"

/**
 * @description
 *  - this is the method that updates the file tree in the database
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project belongs too
 * @param projectId 
 *  - this is the id of project
 * @param newFileTree 
 *  - this is the updated file tree we want to be stored in the server
 * @returns 
 *  - returns undefined if successful, otherwise returns an error message
 */
const LunarRefreshAPI_updateFileTree = async (
    token: string,
    lunarId: string,
    organizationId: string,
    projectId: string,
    newFileTree: ISimpleFilesystem
) => {
    //first we need to generate the body
    const body: ILunarUpdateFiletreeBody = {
        lunarId,
        organizationId,
        projectId,
        newFiletree: newFileTree
    }

    //generate the request options
    const url = `${server}/api/v1/refresh/lunar/update/file-tree`
    const options = GenerateOptions("POST", token, body)
    const resp = await GET_Cacheless<IStatus>(url, options)

    //validate the resp
    if(resp.error === true)
        return resp.msg
    else
        return undefined
}

/**
 * @description
 *  - this is the method that calls the update name endpoint on the server
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project belongs too
 * @param projectId 
 *  - this is the id of project
 * @param name 
 *  - this is the new name for the project
 * @returns 
 *  - returns undefined if successful, otherwise returns an error message
 */
const LunarRefreshAPI_updateName = async (
    token: string,
    lunarId: string,
    organizationId: string,
    projectId: string,
    name: string
) => {
    //first we need to generate the body
    const body: ILunarUpdateNameBody = {
        lunarId,
        organizationId,
        projectId,
        name
    }

    //now we need to geherate the request options
    const url = `${server}/api/v1/refresh/lunar/update/name`
    const options = GenerateOptions("POST", token, body)
    const resp = await GET_Cacheless<IStatus>(url, options)

    //validate the resp
    if(resp.error === true)
        return resp.msg
    else
        return undefined
}

/**
 * @description
 *  - this is the method that calls the update chart endpoint on the server
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project belongs too
 * @param projectId 
 *  - this is the id of project
 * @param newCharts 
 *  - these are the new charts for the project
 * @returns 
 *  - returns undefined if successful, otherwise returns an error message
 */
const LunarRefreshAPI_updateCharts = async (
    token: string,
    lunarId: string,
    organizationId: string,
    projectId: string,
    newCharts: ILunarChart[]
) => {
    //first we need to generate the body
    const body: ILunarUpdateChartsBody = {
        lunarId,
        organizationId,
        projectId,
        newCharts
    }

    //now we need to geherate the request options
    const url = `${server}/api/v1/refresh/lunar/update/chart`
    const options = GenerateOptions("POST", token, body)
    const resp = await GET_Cacheless<IStatus>(url, options)

    //validate the resp
    if(resp.error === true)
        return resp.msg
    else
        return undefined
}

/**
 * @description
 *  - this is the method that calls the update note endpoint on the server
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project belongs too
 * @param projectId 
 *  - this is the id of project
 * @param newNotes 
 *  - these are the new notes for the project
 * @returns 
 *  - returns undefined if successful, otherwise returns an error message
 */
const LunarRefreshAPI_updateNotes = async (
    token: string,
    lunarId: string,
    organizationId: string,
    projectId: string,
    newNotes: ILunarNote[]
) => {
    //first we need to generate the body
    const body: ILunarUpdateNotesBody = {
        lunarId,
        organizationId,
        projectId,
        newNotes
    }

    //now we need to geherate the request options
    const url = `${server}/api/v1/refresh/lunar/update/note`
    const options = GenerateOptions("POST", token, body)
    const resp = await GET_Cacheless<IStatus>(url, options)

    //validate the resp
    if(resp.error === true)
        return resp.msg
    else
        return undefined
}

export {
    LunarRefreshAPI_updateFileTree,
    LunarRefreshAPI_updateName,
    LunarRefreshAPI_updateCharts,
    LunarRefreshAPI_updateNotes
}