import { v4 } from "uuid"
import { ISigmyzeFilesystem, ISigmyzeFolder } from "../../../ui/file-management/types"

/**
 * @description
 *  - this function is meant to create a simple folder object based on a name
 * @param folderName
 *  - this is the name of the folder we are trying to create
 * @param setOutputFolderId
 *  - this is the function that handles the setting of the folderId
 */
const createFolderHelper = (folderName: string, setOutputFolderId: (folderId: string) => void) => {
    let folder: ISigmyzeFolder = {
        folderName: folderName,
        folderId: v4(),
        folders: [],
        files: [],
        openState: false
    }

    setOutputFolderId(folder.folderId)
    return folder
}

/**
 * NOTE: This is a helper function meant to only be used within the context of the createFolder function
 * usage outside of it may incur undefined behavior 
 * 
 * @description
 *  - this is a recursive function that handles the insertion of a folder into the activeFolderId
 * @param folder
 *  - this is the folder we are recursiveley searching through in order to insert a new folder
 * @param activeFolderId
 *  - this is the id of the folder we want to insert the new folder into
 * @param folderName
 *  - this is the name of the new folder we want to be created
 * @param setOutputFolderId
 *  - this is the function that handles the setting of the folderId
 */
const insertFolder = (
    folder: ISigmyzeFolder, 
    activeFolderId: string, 
    folderName: string,
    setOutputFolderId: (folderId: string) => void
) => {
    let newFolder = folder
    if(newFolder.folderId === activeFolderId) {
        newFolder.folders.push(createFolderHelper(folderName, setOutputFolderId))
        return newFolder
    }

    //now we want to iterate thru the subfolders and append the folder
    let newInnerFolders: ISigmyzeFolder[] = []
    let folders = newFolder.folders
    for(let i = 0; i < folders.length; i++) {
        let innerFolder = folders[i]
        innerFolder = insertFolder(innerFolder, activeFolderId, folderName, setOutputFolderId)

        newInnerFolders.push(innerFolder)
    }

    newFolder.folders = newInnerFolders
    return newFolder
}

interface ICreateFolderOutput {
    filesystem: ISigmyzeFilesystem,
    folderId: string | undefined
}

/**
 * @description
 *  - this is the function that handles the creation of a folder within the provided sigmyze filesystem
 * @param activeFolderId 
 *  - this is the folder id of the folder we want to create the new folder in
 * @param folderName 
 *  - this is the name of the new folder
 * @param filesystem 
 *  - this is the filesystem we want to insert the folder into
 */
const createFolder = (
    activeFolderId: string | undefined, 
    folderName: string, 
    filesystem: ISigmyzeFilesystem | undefined,
) => {
    let newFilesystem = filesystem
    if(activeFolderId === undefined || newFilesystem === undefined)
        return

    //since we can only create folders within folders and the root we will only iterate through the folders to create a folder
    let newFolders = [] as ISigmyzeFolder[]
    let outputFolderId: string | undefined = undefined

    //here is a helper method so that we can track the value of hte created folder id
    const setOutputFolderId = (folderId: string) => {
        outputFolderId = folderId
    }

    for(let i = 0; i < newFilesystem.folders.length; i++) {
        let folder = newFilesystem.folders[i]
        folder = insertFolder(folder, activeFolderId, folderName, setOutputFolderId)

        newFolders.push(folder)
    }

    newFilesystem.folders = newFolders
    //create the output object
    let outputObject = {} as ICreateFolderOutput
    outputObject.filesystem = newFilesystem
    outputObject.folderId = outputFolderId

    return outputObject
}

/**
 * NOTE: This function is only meant to be used within the setFolderState function
 * usage outside may caused undefined behavior
 * 
 * @description
 *  - this is a recursive function that handles the setting of a SigmyzeFolder's openState field
 * @param folder
 *  - this is the folder we are looking through in order to set the correct folder's openState
 * @param folderId
 *  - this is the id of the folder we want to set the openState field
 * @param openState
 *  - this is the openState value we want to be set in the folder
 */
const setFolderOpenStateRECURSE = (
    folder: ISigmyzeFolder,
    folderId: string,
    openState: boolean
) => {
    if(folder.folderId === folderId) {
        folder.openState = openState
        return folder
    }

    //go through all the child folders to set the potential open state
    let newFolders = [] as ISigmyzeFolder[]
    for(let i = 0; i < folder.folders.length; i++) {
        let childFolder = folder.folders[i]
        childFolder = setFolderOpenStateRECURSE(childFolder, folderId, openState)

        newFolders.push(childFolder)
    }

    folder.folders = newFolders
    return folder
}

/**
 * @description
 *  - this is the root function that handles the setting of a folder's openState
 * @param filesystem 
 *  - this is the filesystem where the folder is located
 * @param folderId 
 *  - this is the id of the folder we want to set the openState for
 * @param openState 
 *  - this is the openState value we want to set in the folder
 */
const setFolderOpenState = (
    filesystem: ISigmyzeFilesystem | undefined,
    folderId: string,
    openState: boolean
) => {
    let newFilesystem = filesystem
    if(newFilesystem === undefined)
        return undefined

    //since we are going thru folders only, we will only iterate thru folders
    let newFolders = [] as ISigmyzeFolder[]
    for(let i = 0; i < newFilesystem.folders.length; i++) {
        let folder = newFilesystem.folders[i]
        folder = setFolderOpenStateRECURSE(folder, folderId, openState)

        newFolders.push(folder)
    }

    newFilesystem.folders = newFolders
    return newFilesystem
}

export { createFolder, setFolderOpenState }