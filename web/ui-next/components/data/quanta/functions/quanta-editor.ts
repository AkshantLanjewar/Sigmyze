import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "../../../quanta/quanta-editor/types/types"
import { UpdateProject } from "../quanta-api"
import { IQuantaEditorProject, IQuantaProjectData } from "../types/project"

function GetEditorProjects(fileId: string, editorProjects: IQuantaEditorProject[]) {
    let editorProject = undefined
    for(let i = 0; i < editorProjects.length; i++) {
        let _editorProject = editorProjects[i]
        if(_editorProject.fileId === fileId)
            editorProject = _editorProject
    }

    return editorProject
}

function SetEditorProjectData(
    fileId: string, 
    nodes: IQuantaRFNode[], 
    edges: IQuantaRFEdge[],
    quantaStore: IQuantaStore,
    editorProjects: IQuantaEditorProject[],
    setEditorProjects: (editor: IQuantaEditorProject[]) => void
) {
    let index = undefined
    for(let i = 0; i < editorProjects.length; i++) {
        let editorProject = editorProjects[i]
        if(editorProject.fileId === fileId)
            index = i
    }

    let newData = {} as IQuantaEditorProject
    newData.fileId = fileId
    newData.nodes = nodes
    newData.edges = edges
    newData.quantaStore = quantaStore

    let newEditorProjects = editorProjects ? editorProjects : []
    if(index === undefined)
        newEditorProjects.push(newData)
    else
        newEditorProjects[index] = newData

    setEditorProjects([ ...newEditorProjects ])
}

async function SaveQuantaProject(
    token: string,
    organizationId: string,
    projectId: string,
    projectData: IQuantaProjectData | undefined,
    editorProjects: IQuantaEditorProject[]
) {
    if(projectData === undefined)
        return
    if(projectData.store === undefined)
        projectData.store = { selectors: [], editorProjects }

    projectData.store.editorProjects = editorProjects
    await UpdateProject(token, organizationId, projectId, projectData)
}

export { 
    GetEditorProjects,
    SetEditorProjectData,
    SaveQuantaProject 
}