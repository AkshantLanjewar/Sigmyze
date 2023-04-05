import { IStatus } from "../datasets/DatasetsTypes"
import { GenerateOptions, GET_Cacheless, server } from "../utils"
import { 
    IDriveCreateFolder, 
    IDriveCreateProject, 
    IDriveDeleteFolder, 
    IDriveDeleteProject, 
    IDriveUpdateFolder, 
    IDriveUpdateProject
} from "./types"

async function CreateFolder(token: string, organization_id: string, parent: string, name: string) {
    let body = {
        folder_name: name,
        parent_folder: parent,
        organization_id: organization_id
    } as IDriveCreateFolder

    let url = `${server}/api/v2/drive/create-folder`
    let options = GenerateOptions("POST", token, body)

    return await GET_Cacheless<IStatus>(url, options)
}

async function DeleteFolder(token: string, organization_id: string, parent: string, id: string) {
    let body = {
        folder_id: id,
        parent_folder: parent,
        organization_id: organization_id
    } as IDriveDeleteFolder

    let url = `${server}/api/v2/drive/delete-folder`
    let options = GenerateOptions("POST", token, body)

    return await GET_Cacheless<IStatus>(url, options)
}

async function UpdateFolder(token: string, organization_id: string, parent: string, id: string, name?: string) {
    let body = {
        folder_id: id,
        parent_folder: parent,
        organization_id: organization_id
    } as IDriveUpdateFolder
    if(name !== undefined)
        body.folder_name = name

    let url = `${server}/api/v2/drive/update-folder`
    let options = GenerateOptions("POST", token, body)
    return await GET_Cacheless<IStatus>(url, options)
}

//TODO: Once more types are created, add type differentiation
async function CreateProject(token: string, organization_id: string, parent: string, name: string, type: string) {
    let body = {
        project_name: name,
        parent_folder: parent,
        organization_id: organization_id,
        project_type: type
    } as IDriveCreateProject

    let url = `${server}/api/v2/drive/create-project`
    let options = GenerateOptions("POST", token, body)

    return await GET_Cacheless<IStatus>(url, options)
}

async function DeleteProject(token: string, organization_id: string, parent: string, id: string, type: string) {
    let body = {
        project_id: id,
        parent_folder: parent,
        organization_id: organization_id,
        project_type: type
    } as IDriveDeleteProject

    let url = `${server}/api/v2/drive/delete-project`
    let options = GenerateOptions("POST", token, body)

    return await GET_Cacheless<IStatus>(url, options)
}

async function UpdateProject(token: string, organization_id: string, parent: string, id: string, type: string, name?: string) {
    let body = {
        project_id: id,
        parent_folder: parent,
        organization_id: organization_id,
        project_type: type
    } as IDriveUpdateProject
    if(name !== undefined)
        body.project_name = name

    let url = `${server}/api/v2/drive/update-project`
    let options = GenerateOptions("POST", token, body)
    return await GET_Cacheless<IStatus>(url, options)
}

export { 
    CreateFolder,
    DeleteFolder,
    UpdateFolder,
    CreateProject,
    DeleteProject,
    UpdateProject 
}