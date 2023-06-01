import { IFilesystem, IFolder } from "../types";

const getFileDirectory = (
    fileId: string,
    editorFilesystem: IFilesystem | undefined
) => {
    if(editorFilesystem === undefined)
        return undefined

    let internalFiles = editorFilesystem.files ? editorFilesystem.files : []
    let internalFolders = editorFilesystem.folders ? editorFilesystem.folders : []

    for(let i = 0; i < internalFiles.length; i++) {
        let file = internalFiles[i]
        if(file.item_id === fileId)
            return undefined
    }

    for(let i = 0; i < internalFolders.length; i++) {
        let folder = internalFolders[i]
        let folder_id = getFileDirectoryRecurse(fileId, folder)
        if(folder_id === undefined)
            continue

        return folder_id
    }

    return undefined
}

const getFileDirectoryRecurse = (
    fileId: string,
    folder: IFolder
): string | undefined => {
    let internalFiles = folder.files ? folder.files : []
    let internalFolders = folder.folders ? folder.folders : []
    
    let folder_id = folder.item_id
    if(folder_id == undefined)
        return undefined

    for(let i = 0; i < internalFiles.length; i++) {
        let file = internalFiles[i]
        if(file.item_id === fileId)
            return folder_id
    }

    for(let i = 0; i < internalFolders.length; i++) {
        let folder = internalFolders[i]
        let folder_id = getFileDirectoryRecurse(fileId, folder)
        if(folder_id === undefined)
            continue

        return folder_id
    }

    return undefined
}

export { getFileDirectory }