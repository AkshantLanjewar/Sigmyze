import { ISigmyzeFile, ISigmyzeFilesystem, ISigmyzeFolder, ISimpleFilesystem, ISimpleFolder } from "../../../ui/file-management/types"
import { ILunarChart, ILunarNote, ILunarProject } from "../state"

/**
 * NOTE: This is not a project template generator, that has not been created yet.
 * This is a utility function that generates a default project if the user is not logged in / has loaded a project.
 */
const generateDefaultProject = (): ILunarProject => {
    let project = {
        projectId: "default-project",
        name: "Untitled Project",
        notes: [],
        charts: [],
        fileSystem: {
            files: [],
            folders: []
        }
    } as ILunarProject

    return project
}

/**
 * NOTE: This function is a helper function for convertSimpleFilesystem
 * it is to not be used outside of that context, otherwise it may behave in an unintended manner.
 * 
 * @description
 *  - This is the raw function that creates a SigmyzeFolder given a SimpleFolder. 
 *  - It uses recursion in order to handle the simplefolders child folders
 * @param folder
 *  - this is the simple folder we want to convert into a sigmyzefolder
 * @param charts
 *  -  this is the list of charts created within the project. This is needed since file's are only stored as fileId's
 * @param notes
 *  - this is the list of notes created within the project. This is needed sincel file's are only stored as fileId's.
 */
const createProjectFolder = (folder: ISimpleFolder, charts: ILunarChart[], notes: ILunarNote[]) => {
    //we first want to create an output object we can fill in with the data we collect
    let outputFolder = {
        folderId: folder.folderId,
        folderName: folder.folderName,
        folders: [],
        files: []
    } as ISigmyzeFolder

    //now we want to iterate through all the files and add them to the output folder
    let folderFiles = folder.files
    for(let i = 0; i < folderFiles.length; i++) {
        let file = folderFiles[i]
        let sigmyzeFile = createProjectFile(file, charts, notes)
        if(sigmyzeFile === undefined)
            continue

        outputFolder.files.push(sigmyzeFile)
    }

    //now we wanna recurse and call this function to generate folders for all the child folders
    let folderFolders = folder.folders
    for(let i = 0; i < folderFolders.length; i++) {
        let innerfolder = folderFolders[i]
        let sigmyzeFolder = createProjectFolder(innerfolder, charts, notes)
        if(sigmyzeFolder === undefined)
            continue

        outputFolder.folders.push(sigmyzeFolder)
    }

    return outputFolder
}

const FILE_TYPE_CHART = "quanta::chart"
const FILE_TYPE_NOTE = "quanta::note"

/**
 * NOTE: This function is a helper function for convertSimpleFilesystem.
 * It is to not be used outside of that context, otherwsie the code may not work in intented ways
 * @description
 *  - This is the function that handles the conversion of a fileId into a full sigmyze file object. 
 *  - It is able to discern whether the fileId belongs to either a chart or note file, creating the appropriate SigmyzeFile.
 * @param fileId 
 *  - this is the fileId of the sigmyzefile we want to create.
 * @param charts 
 *  - theese are the charts that were created in the project. Used to create the completed SigmyzeFile object.
 * @param notes 
 *  - theese are the notes that were created in the project. Used to create the completed SigmyzeFile object.
 */
const createProjectFile = (fileId: string, charts: ILunarChart[], notes: ILunarNote[]): ISigmyzeFile | undefined => {
    let index: number | undefined = undefined
    let fileType = FILE_TYPE_CHART

    //first we are going to iterate thru the charts to see if the fileId is in there
    for(let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        if(chart.objectId === fileId) {
            index = i
            fileType = FILE_TYPE_CHART
        }
    }

    //then we are going to iterate thru the notes to check if the fileId is in there
    for(let i = 0; i < notes.length; i++) {
        let note = notes[i]
        if(note.objectId === fileId) {
            index = i
            fileType = FILE_TYPE_NOTE
        }
    }

    if(index === undefined)
        return undefined

    //now we are going to create the file object based on the collected info
    let outputFile = {} as ISigmyzeFile
    switch(fileType) {
        case FILE_TYPE_CHART:
            let chart = charts[index]
            outputFile.fileName = chart.name
            outputFile.fileType = FILE_TYPE_CHART
            outputFile.fileId = chart.objectId

            break
        case FILE_TYPE_NOTE:
            let note = notes[index]
            outputFile.fileName = note.name
            outputFile.fileType = FILE_TYPE_NOTE
            outputFile.fileId = note.objectId

            break
        default:
            return undefined
    }

    return outputFile
}

/**
 * @description
 *  - this is the root function that handles the conversion of a simplefilesystem into a sigmyze filesystem
 * @param projectName 
 *  - this is the name of the project we want the filesystem to have. since we need to generate a root folder, this will be that root folder's name.
 * @param simpleFilesystem 
 *  - this is the simple filesystem we want to convert
 * @param charts 
 *  - theese are the charts that have been created within the project
 * @param notes 
 *  - theese are the notes that have been created within the project
 * @returns 
 *  - the converted ISigmyzeFilesystem
 */
const convertSimpleFilesystem = (
    projectName: string, 
    simpleFilesystem: ISimpleFilesystem,
    charts: ILunarChart[],
    notes: ILunarNote[]
) => {
    let outputProject: ISigmyzeFilesystem = {
        name: 'lunar-filesystem',
        files: [],
        folders: [{
            folderId: 'project-root',
            folderName: projectName,
            folders: [],
            files: []
        }]
    }

    //now we need to go though the process and update the filesystem
    let rootFiles = simpleFilesystem.files
    for(let i = 0; i < rootFiles.length; i++) {
        let rootFile = rootFiles[i]
        let sigmyzeFile = createProjectFile(rootFile, charts, notes)
        if(sigmyzeFile === undefined)
            continue

        outputProject.folders[0].files.push(sigmyzeFile)
    }

    //now we need to go through all the folders in the root and generate them using the create-folder function
    let rootFolders = simpleFilesystem.folders
    for(let i = 0; i < rootFolders.length; i++) {
        let folder = rootFolders[i]
        let sigmyzeFolder = createProjectFolder(folder, charts, notes)
        outputProject.folders[0].folders.push(sigmyzeFolder)
    }

    return outputProject
}

/**
 * NOTE: this is a helper function for the convertSigmyzeToSimple function
 * dont use the function outside the above function due to possible undefined behavior
 * 
 * @description
 *  - this function handles the conversion of a sigmyze folder into its simple folder equivilant
 * @param folder
 *  - this is the sigmyze folder we want to be converted
 * @returns
 *  - the converted SimpleFolder
 */
const convertFolderToSimple = (folder: ISigmyzeFolder) => {
    let outputFolder: ISimpleFolder = {
        files: [],
        folders: [],
        folderName: folder.folderName,
        folderId: folder.folderId
    }

    //first we want to go thru the root files and add them to the folder
    let rootFiles = folder.files
    for(let i = 0; i < rootFiles.length; i++) {
        let file = rootFiles[i]
        outputFolder.files.push(file.fileId)
    }

    //now we want to recurse and add all the subfolders to the folder
    let rootFolders = folder.folders
    for(let i = 0; i < rootFolders.length; i++) {
        let rootFolder = rootFolders[i]
        let simpleFolder = convertFolderToSimple(rootFolder)

        outputFolder.folders.push(simpleFolder)
    }

    return outputFolder
}

/**
 * @description
 *  - this function handles the conversion of a sigmyze filesystem into a simple filesystem for backend storage.
 * @param sigmyzeFilesystem 
 *  - this is the filesystem we want to be converted.
 * @returns 
 *  - the converted simplefilesystem.
 */
const convertSigmyzeToSimple = (sigmyzeFilesystem: ISigmyzeFilesystem) => {
    let simpleFilesystem: ISimpleFilesystem = {
        folders: [],
        files: []
    }

    //first we want to go through the root files and add them to the filesystem
    let rootFiles = sigmyzeFilesystem.folders[0].files
    for(let i = 0; i < rootFiles.length; i++) {
        let file = rootFiles[i]
        simpleFilesystem.files.push(file.fileId)
    }

    //then we want to go through the root folders and add them to the filesystem
    let rootFolders = sigmyzeFilesystem.folders[0].folders
    for(let i = 0; i < rootFolders.length; i++) {
        let folder = rootFolders[i]
        let simpleFolder = convertFolderToSimple(folder)

        simpleFilesystem.folders.push(simpleFolder)
    }

    return simpleFilesystem
}

export { 
    generateDefaultProject,
    convertSimpleFilesystem,
    convertSigmyzeToSimple 
}