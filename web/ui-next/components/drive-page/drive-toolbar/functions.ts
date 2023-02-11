import { IDriveFolder, IDriveProject, IDriveResp } from "../../data/organization/types";
import { IToolbarBreadcrumb } from "./drive-toolbar";

function hasChild(folders: IDriveFolder[], activeId: string) : boolean {
    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]

        if(folder.folder_id === activeId)
            return true
        else
            return hasChild(folder.folders!, activeId)
    }
    
    return false
}

function addPathBreadcrumb(paths: IToolbarBreadcrumb[], folders: IDriveFolder[], activeId: string) {
    let nPaths = paths
    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]

        if(folder.folder_id === activeId) {
            nPaths.push({ directory_id: folder.folder_id, directory_name: folder.folder_name! })
            return nPaths
        } else if(hasChild(folder.folders!, activeId)) {
            nPaths.push({ directory_id: folder.folder_id!, directory_name: folder.folder_name! })
            nPaths = addPathBreadcrumb(nPaths, folder.folders!, activeId)
        }
    }

    return nPaths
}

function GetWorkingPaths(drive: IDriveResp, activeId: string) {
    let paths = [] as IToolbarBreadcrumb[]
    let folders = drive.folders
    if(folders === undefined)
        return paths
    paths = addPathBreadcrumb(paths, folders, activeId)

    return paths
}

function getItem(folders: IDriveFolder[], id: string) : IDriveFolder | IDriveProject | null {
    let element = null
    for(let i = 0; i < folders.length && element === null; i++) {
        let folder = folders[i]
        let projects = folder.projects
        if(projects === undefined)
            continue

        for(let x = 0; x < projects.length; x++) {
            let project = projects[x]
            if(project.project_id === id)
                return project
        }
        
        if(folder.folder_id === id)
            return folder
        else
            element = getItem(folder.folders!, id)
    }

    return element
}

function GetProjectElement(drive: IDriveResp, id: string) {
    let element = null
    let folders = drive.folders
    let projects = drive.projects

    if(folders === undefined)
        return null
    if(projects === undefined)
        return null

    for(let i = 0; i < projects.length; i++) {
        let project = projects[i]
        if(project.project_id === id)
            return project
    }

    element = getItem(folders, id)
    return element
}

export { 
    GetWorkingPaths,
    GetProjectElement 
}