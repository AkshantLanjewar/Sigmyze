import { ILunarProjectData } from "../../lunar/types"

interface IOrganizationController {

}

interface IOrganization {
    organization_id: string,
    organization_name: string,
}

interface IDrive {
    drive_id: string,
    projects: ILunarProjectData[],
    folders: IFolder[]
}

interface IFolder {
    folder_id: string,
    folder_name: string,

    projects: ILunarProjectData[],
    folders: IFolder[]
}

export type { IOrganizationController }