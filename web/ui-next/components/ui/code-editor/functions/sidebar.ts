import { Dispatch, SetStateAction } from "react"
import { IFile, IFilesystem, IFolder } from "../types"
import { getFileDirectory } from "./directory"

const getFile = (
    fileId: string,
    editorFilesystem: IFilesystem | undefined
) => {
    if(editorFilesystem === undefined)
        return
    if(editorFilesystem.files === undefined || editorFilesystem.folders === undefined)
        return

    let selected_file = undefined
    for(let i = 0; i < editorFilesystem.files.length; i++) {
        let _file = editorFilesystem.files[i]
        if(_file.item_id === fileId) {
            selected_file = _file
            break
        }
    }

    //now we go thu the folders
    for(let i = 0; i < editorFilesystem.folders.length; i++) {
        let _file = getFileFolders(editorFilesystem.folders[i], fileId)
        if(_file === undefined)
            continue

        selected_file = _file
    }

    return selected_file
}

//helper function for above
const getFileFolders = (folder: IFolder, itemId: string): IFile | undefined => {
    if(folder.files === undefined)
        return undefined

    for(let i = 0; i < folder.files.length; i++) {
        let file = folder.files[i]
        if(file.item_id === itemId)
            return file
    }

    let internal_folders = folder.folders ? folder.folders : []
    let selected_file = undefined

    for(let i = 0; i < internal_folders.length; i++) {
        let file = getFileFolders(internal_folders[i], itemId)
        if(file === undefined)
            continue

        selected_file = file
    }

    return selected_file
}

//function to open a file when clicked on the sidebar
const openFile = (
    fileId: string,
    activeFile: string | undefined,
    editorFilesystem: IFilesystem | undefined,
    setActiveFile: Dispatch<SetStateAction<string | undefined>>,
    setActiveItem: Dispatch<SetStateAction<string | undefined>>,
    setActiveDirectory: Dispatch<SetStateAction<string | undefined>>
) => {
    setActiveItem(fileId)
    if(activeFile === fileId)
        return

    //we need to find the directory this file is in so we can properly set the active directory
    let directoryId = getFileDirectory(fileId, editorFilesystem)
    setActiveDirectory(directoryId)

    setActiveFile(fileId)
}

const selectDirectory = (
    directoryId: string,
    setActiveItem: Dispatch<SetStateAction<string | undefined>>,
    setActiveDirectory: Dispatch<SetStateAction<string | undefined>>
) => {
    setActiveItem(directoryId)
    setActiveDirectory(directoryId)
}

const unselectItems = (
    setActiveDirectory: Dispatch<SetStateAction<string | undefined>>,
    setActiveItem: Dispatch<SetStateAction<string | undefined>>,
) => {
    setActiveDirectory(undefined)
    setActiveItem(undefined)
}

export {
    getFile,
    openFile,
    unselectItems,
    selectDirectory
}