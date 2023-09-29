import { ISigmyzeFolder } from "../../types"

/**
 * @description
 *  - this is a function that helps determine whether a child file is active or not in a folder.
 *  - returns a boolean quantity.
 * @param folder 
 *  - this is the folder we are looking through in order to check if a child is active or not
 * @param activeItemId 
 *  - this is the id of the active file or folder
 */
const isChildActive = (folder: ISigmyzeFolder, activeItemId: string) => {
    //first we want to look through the root files in the folder
    for(let i = 0; i < folder.files.length; i++) {
        let file = folder.files[i]
        if(file.fileId === activeItemId)
            return true
    }

    //now we want to recursively check all the folders within this folder
    for(let i = 0; i < folder.folders.length; i++) {
        let testFolder = folder.folders[i]
        if(isChildActive(testFolder, activeItemId) === true)
            return true
    }
    
    return false
}

export { isChildActive }