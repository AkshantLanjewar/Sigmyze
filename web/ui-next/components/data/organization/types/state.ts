import { SetStateAction } from "react"
import { ILunarProjectData } from "../../lunar/types"

interface IOrganizationController {
    //NOTE: State relating to the current organization
    organizations?: IOrganization[],
    selectedOrganization: string | null,
    activeDirectory: string,
    updateDrive: boolean,

    //NOTE: state relating to the drive id
    selectedDriveId: string | null,

    //FEATURE: function to change organization
    setOrganization: (id: string) => void,
    //FEATURE: function to update the drive from the database
    toggleDrive: () => void
    //FEATURE: function to select drive item
    setSelectedDriveId: (value: SetStateAction<string | null>) => void 
    //FEATURE: function to set the active directory
    setActiveDirectory: (value: SetStateAction<string>) => void
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

export type { 
    IOrganizationController,
    IOrganization 
}