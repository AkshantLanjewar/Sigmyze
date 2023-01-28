import { IStatus } from "../datasets/DatasetsTypes"
import { GenerateOptions, GET_Cacheless, server } from "../utils"
import { IDriveCreateFolder, IDriveCreateProject } from "./types"

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

//TODO: Once more types are created, add type differentiation
async function CreateProject(token: string, organization_id: string, parent: string, name: string) {
    let body = {
        project_name: name,
        parent_folder: parent,
        organization_id: organization_id
    } as IDriveCreateProject

    let url = `${server}/api/v2/drive/create-project`
    let options = GenerateOptions("POST", token, body)

    return await GET_Cacheless<IStatus>(url, options)
}

export { 
    CreateFolder,
    CreateProject 
}