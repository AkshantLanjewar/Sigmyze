import { IDriveFolder, IDriveResp } from "../../../data/organization/types";
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

export { GetWorkingPaths }