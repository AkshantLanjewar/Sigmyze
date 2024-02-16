import { IStatus } from '../../../data/datasets/DatasetsTypes'
import { GET_Cacheless, GenerateOptions, server } from '../../../data/utils'
import { FetchProjectDataResponse, IFetchProjectDataResponse, ILunarCreateProjectBody, ILunarCreateResponse, ILunarDeleteProjectBody, ILunarUpdateFiletreeBody, LunarCreateResponse } from './types'

/**
 * @description
 *  - this is the method that calls the createProject endpoint on the server
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project will belong too
 * @param projectId 
 *  - this is the id of the new project
 * @param name 
 *  - this is the name of the new project
 * @returns 
 *  - returns a string if a new id was generated, otherwise undefined
 */
const LunarRefreshAPI_createProject = async (
    token: string, 
    lunarId: string,
    organizationId: string,
    projectId: string,
    name: string
) => {
    //first we are going to generate the project body
    const body: ILunarCreateProjectBody = {
        lunarId,
        organizationId,
        projectId,
        name
    }

    //generate the request options
    const url = `${server}/api/v1/refresh/lunar/create`
    const options = GenerateOptions("POST", token, body)
    let resp = await GET_Cacheless<ILunarCreateResponse>(url, options)
    const respObject = new LunarCreateResponse(resp)

    //validate resp
    if(respObject.validate() === false)
        return undefined
    else
        return resp.newId
}

/**
 * @description
 *  - this is the method that calls the deleteProject endpoint on the server
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project belongs too
 * @param projectId 
 *  - this is the id of project
 */
const LunarRefreshAPI_deleteProject = async (
    token: string,
    lunarId: string,
    organizationId: string,
    projectId: string,
) => {
    //first we are going to generate the body
    const body: ILunarDeleteProjectBody = {
        lunarId,
        organizationId,
        projectId
    }

    //generate the request options
    const url = `${server}/api/v1/refresh/lunar/delete`
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
 *  - this is the method that calls the fetch project data endpoint
 * @param token 
 *  - this is the authorization token, must be logged in for route
 * @param lunarId 
 *  - this is the lunarId of the user who is making the request
 * @param organizationId 
 *  - this is the id of the organizaiton the project belongs too
 * @param projectId 
 *  - this is the id of project
 * @returns 
 *  - returns valid Project Data if the request is successful, undefined otherwise
 */
const LunarRefreshAPI_fetchProject = async (
    token: string,
    lunarId: string,
    organizationId: string,
    projectId: string,
) => {
    // generate the request options
    const url = `${server}/api/v1/refresh/lunar/${lunarId}/${organizationId}/${projectId}`
    const options = GenerateOptions("GET", token)
    const resp = await GET_Cacheless<IFetchProjectDataResponse>(url, options)

    const parsedResp = new FetchProjectDataResponse(resp)
    if(parsedResp.validate() === false)
        return undefined
    else
        return parsedResp.projectData
}

export * from './update'
export * from './types'

export {
    LunarRefreshAPI_createProject,
    LunarRefreshAPI_deleteProject,
    LunarRefreshAPI_fetchProject
}