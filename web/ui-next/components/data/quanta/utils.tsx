import { v4 } from "uuid"
import { IQuantaDataStore, IQuantaFile, IQuantaProjectData } from "./types/project"

function buildQuantaFile(name: string, type: string) : IQuantaFile {
    let file = {} as IQuantaFile
    file.name = name
    file.type = type
    file.id = v4()

    return file
}

function DefaultQuantaProject() : IQuantaProjectData {
    let defaultProject = {} as IQuantaProjectData
    defaultProject.dataset_name = "Demo Dataset"
    defaultProject.files = [] as IQuantaFile[]
    defaultProject.store = {} as IQuantaDataStore

    //build out the individual pages
    defaultProject.files.push(buildQuantaFile("Overview", "overview"))
    defaultProject.files.push(buildQuantaFile("Create Dataset", "node_editor"))
    defaultProject.files.push(buildQuantaFile("Update Dataset", "node_editor"))
    defaultProject.files.push(buildQuantaFile("Selectors", "selectors"))

    return defaultProject
}

export { DefaultQuantaProject }