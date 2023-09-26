import { v4 } from "uuid"
import { ISigmyzeFile, ISigmyzeFilesystem, ISigmyzeFolder } from "../../../ui/file-management/types"

/**
 * NOTE: this is a utility function aimed at creating a basic sigmyze file with the given parameters
 * 
 * @param fileName 
 *  - this is the name of the new file
 * @param fileType 
 *  - this is the file-type of the new file 
 * @param addCreateSynchroMessage 
 *  - this function ensures that the data context reacts and creates the correct data due to the file being created.
 */
const createFileTemplate = (
    fileName: string, 
    fileType: string,
    addCreateSynchroMessage: (fileName: string, fileType: string, fileId: string) => void
): ISigmyzeFile => {
    let sigmyzeFile =  {
        fileName: fileName,
        fileType: fileType,
        fileId: v4()
    }

    //we need to create a parsed file type for the synchro message
    let fileTypeSplit = fileType.split("::")
    let parsedFileType = fileTypeSplit[1]

    addCreateSynchroMessage(fileName, parsedFileType, sigmyzeFile.fileId)
    return sigmyzeFile
}

/**
 * NOTE: This is a child function for the createFile method
 * if used outside, undefined behaviour may occur
 * 
 * @description
 *  - this is the recursive function that handles the insertion of files into the subfolders within the filesystme
 * @param folder
 *  - this is the sigmyze folder we are searching through
 * @param activeFolderId 
 *  - this is the id of the folder we want to insert the file in
 * @param fileName 
 *  - this is the name of the new file
 * @param fileType 
 *  - this is the file-type of the new file 
 * @param addCreateSynchroMessage 
 *  - this function ensures that the data context reacts and creates the correct data due to the file being created.
 */
const insertFileIntoFolder = (
    folder: ISigmyzeFolder, 
    activeFolderId: string, 
    fileName: string, 
    fileType: string,
    addCreateSynchroMessage: (fileName: string, fileType: string, fileId: string) => void
) => {
    let newFolder = folder
    if(newFolder.folderId === activeFolderId) {
        newFolder.files.push(createFileTemplate(fileName, fileType, addCreateSynchroMessage))
        return newFolder
    }

    let newChildFolders: ISigmyzeFolder[] = []
    //go through all the child folders to see if it can be inserted there
    for(let i = 0; i < newFolder.folders.length; i++) {
        let childFolder = newFolder.folders[i]
        childFolder = insertFileIntoFolder(childFolder, activeFolderId, fileName, fileType, addCreateSynchroMessage)

        newChildFolders.push(childFolder)
    }

    newFolder.folders = newChildFolders
    return newFolder
}

/**
 * @description
 *  - this is the root function that handles the creation of a file within the filesystem
 * @param filesystem 
 *  - this is the filesystem we want to create the file inside
 * @param activeFolderId 
 *  - this is the id of the folder we want to insert the file in
 * @param fileName 
 *  - this is the name of the new file
 * @param fileType 
 *  - this is the file-type of the new file 
 * @param addCreateSynchroMessage 
 *  - this function ensures that the data context reacts and creates the correct data due to the file being created.
 */
const createFile = (
    filesystem: ISigmyzeFilesystem | undefined,
    activeFolderId: string | undefined,
    fileName: string,
    fileType: string,
    addCreateSynchroMessage: (fileName: string, fileType: string, fileId: string) => void
) => {
    if(activeFolderId === undefined || filesystem === undefined)
        return undefined

    let newFilesystem = filesystem
    let newFolders = [] as ISigmyzeFolder[]
    if(activeFolderId === "root") {
        newFilesystem.files.push(createFileTemplate(fileName, fileType, addCreateSynchroMessage))
        return newFilesystem
    }

    //now we are going to iterate thru the folders and check where to insert the file based on the given active folder id
    for(let i = 0; i < newFilesystem.folders.length; i++) {
        let folder = newFilesystem.folders[i]
        folder = insertFileIntoFolder(folder, activeFolderId, fileName, fileType, addCreateSynchroMessage)

        newFolders.push(folder)
    }

    newFilesystem.folders = newFolders
    return newFilesystem
}

/**
 * NOTE: This function is only to be used within the grabFile function.
 * @description
 *  - this is a function that grabs the file from a folder recursively
 * @param folder 
 *  - this is the folder we are looking through
 * @param fileId 
 *  - this is the fileId for the file we want to find
 */
const grabFileRecurse = (folder: ISigmyzeFolder, fileId: string): ISigmyzeFile | undefined => {
    //first go through the files
    for(let i = 0; i < folder.files.length; i++) {
        let file = folder.files[i]
        if(file.fileId === fileId)
            return file
    }

    //now we go through the folders to find the file
    for(let i = 0; i < folder.folders.length; i++) {
        let testFolder = folder.folders[i]
        let file = grabFileRecurse(testFolder, fileId)
        if(file !== undefined)
            return file
    }

    return undefined
}

/**
 * @description
 *  - this is a function that helps grab a file frm the filesystem
 * @param filesystem
 *  - this is the filesystem where we want t find the file
 * @param fileId
 *  - this is the id of the file we are trying to find
 */
const grabFile = (
    filesystem: ISigmyzeFilesystem | undefined,
    fileId: string
) => {
    if(filesystem === undefined)
        return undefined

    //first we will go through the root to check if there is a file
    for(let i = 0; i < filesystem.files.length; i++) {
        let testFile = filesystem.files[i]
        if(testFile.fileId === fileId)
            return testFile
    }

    //now we iterate through the folders
    for(let i = 0; i < filesystem.folders.length; i++) {
        let folder = filesystem.folders[i]
        let file = grabFileRecurse(folder, fileId)
        if(file !== undefined)
            return
    }

    return undefined
}

export { 
    createFile,
    grabFile 
}