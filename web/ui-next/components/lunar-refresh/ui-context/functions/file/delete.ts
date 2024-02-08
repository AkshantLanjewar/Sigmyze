import { ISigmyzeFile, ISigmyzeFolder } from "../../../../ui/file-management/types"

interface IDeleteFileOutput {
    /*
     * These are the folders after the delete function was recursively run through them 
     */
    folders: ISigmyzeFolder[],

    /*
     * This is the id of the folder to be set active
     */
    folderId: string | undefined
}

/*
 * This is the function that handles the deletion of a file from the sigmyze filesystem
 * @param folders 
 *  - the folders the function will recurse through 
 * @param fileId 
 *  - the id of the file we want to delete 
 * @param addDeleteSynchroMessage
 *  - this is the function that adds a delete synchro message
 */
const deleteFile = (
    folders: ISigmyzeFolder[], 
    fileId: string,
    addDeleteSynchroMessage: (fileType: string, fileId: string) => void,
    addCloseFileIdTabBulk: (fileIds: string[]) => void
): IDeleteFileOutput => {
    let newFolders: ISigmyzeFolder[] = []
    let folderId: string | undefined = undefined 
    for(let i = 0; i < folders.length; i++) {
        let folder = folders[i]
        let files: ISigmyzeFile[] = []

        for(let x = 0; x < folder.files.length; x++) {
            const file = folder.files[i]
            if(file.fileId === fileId) {
                folderId = folder.folderId
                addDeleteSynchroMessage(file.fileType, file.fileId)

                continue
            }

            files.push(file)
        }
        
        let recurse = deleteFile(folder.folders, fileId, addDeleteSynchroMessage, addCloseFileIdTabBulk)
        folder.files = files
        folder.folders = recurse.folders
        if(recurse.folderId !== undefined)
            folderId = recurse.folderId

        newFolders.push(folder)
    }

    return { folders: newFolders, folderId }
}

export default deleteFile
