import { IStatus } from "../../datasets/DatasetsTypes";
import { IOrganization } from "./state";

interface IOrganizationResp {
    msg?: IStatus,
    organizations?: IOrganization[]
}

interface IDriveResp {
    msg?: IStatus,
    projects?: IDriveProject[],
    folders?: IDriveFolder[]
}

interface IDriveProject {
    project_id?: string,
    project_name?: string,
    project_type?: string
}

interface IDriveFolder {
    folder_id?: string,
    folder_name?: string,
    projects?: IDriveProject[],
    folders?: IDriveFolder[]
}

//HTTP Requests for thed drive

interface IDriveCreateFolder {
    folder_name: string,
    parent_folder: string,
    organization_id: string
}

interface IDriveDeleteFolder {
    folder_id: string,
    parent_folder: string,
    organization_id: string
}

interface IDriveUpdateFolder {
    folder_id: string,
    parent_folder: string,
    organization_id: string,
    folder_name?: string
}

interface IDriveCreateProject {
    project_name: string,
    parent_folder: string,
    organization_id: string,
    project_type: string
}

interface IDriveDeleteProject {
    project_id: string,
    parent_folder: string,
    organization_id: string,
    project_type: string,
}

interface IDriveUpdateProject {
    project_id: string,
    parent_folder: string,
    organization_id: string,
    project_name?: string,
    project_type?: string
}

export type { 
    IOrganizationResp,
    IDriveResp,
    IDriveFolder,
    IDriveProject,
    IDriveCreateFolder,
    IDriveDeleteFolder,
    IDriveUpdateFolder,
    IDriveCreateProject,
    IDriveDeleteProject,
    IDriveUpdateProject 
}