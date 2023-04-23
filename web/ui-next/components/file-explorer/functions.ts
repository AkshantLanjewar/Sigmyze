import { IDriveFolder, IDriveProject, IDriveResp } from "../data/organization/types"
import { IExplorerFolder, IExplorerItem } from "./types"

interface GrabDirectoryResp {
    folders: IDriveFolder[],
    projects: IDriveProject[]
}

//NOTE: This is the recursive helper function for the GrabDirectory method
function _grabDirectory(folders: IDriveFolder[], directory: string) : GrabDirectoryResp | null {
    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]
        if(folder.folder_id === directory)
            return { folders: folder.folders!, projects: folder.projects! }
        if(folder.folders!.length > 0)
            return _grabDirectory(folder.folders!, directory)
    }

    return null
}

function GrabDirectory(resp: IDriveResp, directory: string) {
    let folders = resp.folders
    if(folders === undefined)
        return null

    let projects = resp.projects
    if(projects === undefined)
        return null

    if(directory === "root")
        return { folders, projects }
    return _grabDirectory(folders, directory)
}

function ConvertToFileExplorerData(resp: IDriveResp, activeDirectory: string) {
    let directory = GrabDirectory(resp, activeDirectory)
    if(directory === null)
        return directory

    //convert to folders
    let folders = [] as IExplorerFolder[]
    let folders_r = directory.folders
    for(let i = 0; i < folders_r.length; i++) {
        let folder = folders_r[i]
        
        let nFolder = {} as IExplorerFolder
        nFolder.folder_id = folder.folder_id!
        nFolder.folder_name = folder.folder_name!
        folders.push(nFolder)
    }

    let items = [] as IExplorerItem[]
    let projects_r = directory.projects
    for(let i = 0; i < projects_r.length; i++) {
        let project = projects_r[i]
        let nItem = {} as IExplorerItem
        let project_type = "lunar_project"
        if(project.project_type !== undefined)
            project_type = project.project_type

        nItem.item_type = project_type
        nItem.item_id = project.project_id!
        nItem.item_name = project.project_name!
        items.push(nItem)
    }

    return { folders, items } 
}

export { ConvertToFileExplorerData }