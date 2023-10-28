import { ISigmyzeFilesystem, ISigmyzeFolder } from "../../../../ui/file-management/types"

const editFileTitleRECURSE = (
    folder: ISigmyzeFolder,
    fileId: string,
    newTitle: string
) => {
    //go through this folders files
    let newFolder = folder
    for(let i = 0; i < newFolder.files.length; i++) {
        let file = newFolder.files[i]
        if(file.fileId === fileId)
            file.fileName = newTitle

        newFolder.files[i] = file
    }

    //now recursively go through this folders folder's to find the file
    for(let i = 0; i < newFolder.folders.length; i++) {
        let innerFolder = newFolder.folders[i]
        innerFolder = editFileTitleRECURSE(innerFolder, fileId, newTitle)

        newFolder.folders[i] = innerFolder
    }

    return newFolder
}

const editFileTitle = (
    filesystem: ISigmyzeFilesystem,
    fileId: string,
    newTitle: string
) => {
    //first go through the filesystem's files to check if its in the root filesystem
    let newFilesystem = filesystem
    for(let i = 0; i < newFilesystem.files.length; i++) {
        let file = newFilesystem.files[i]
        if(file.fileId === fileId)
            file.fileName = newTitle

        newFilesystem.files[i] = file
    }

    //then we go through the folders and recursively search through them for the matching file
    for(let i = 0; i < newFilesystem.folders.length; i++) {
        let folder = newFilesystem.folders[i]
        folder = editFileTitleRECURSE(folder, fileId, newTitle)

        newFilesystem.folders[i] = folder
    }

    return newFilesystem
}

export { editFileTitle }