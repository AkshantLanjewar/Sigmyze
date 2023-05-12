import { IconFileCode2 } from "@tabler/icons"
import { INodeExecutionResult } from "../../../quanta/quanta-editor/execution-engine/context/types"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "../../../quanta/quanta-editor/types/types"
import { UpdateProject } from "../quanta-api"
import { IQuantaCategorization, IQuantaEditorProject, IQuantaProjectData, IQuantaSelector, ProjectSchemas } from "../types/project"

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
    executionResults: INodeExecutionResult[],
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
    newData.executionResults = executionResults

    let newEditorProjects = editorProjects ? editorProjects : []
    if(index === undefined)
        newEditorProjects.push(newData)
    else
        newEditorProjects[index] = newData

    setEditorProjects([ ...newEditorProjects ])
}

function SetEditorExecutionData(
    fileId: string,
    executionResults: INodeExecutionResult[],
    editorProjects: IQuantaEditorProject[],
    setEditorProjects: (editor: IQuantaEditorProject[]) => void
) {
    let editorProject = GetEditorProjects(fileId, editorProjects)
    if(editorProject === undefined)
        return

    let nEditorProjects = [] as IQuantaEditorProject[]
    for(let i = 0; i < editorProjects.length; i++) {
        let _editorProject = editorProjects[i]
        if(_editorProject.fileId === fileId) {
            _editorProject.executionResults = executionResults
        }

        nEditorProjects.push({ ..._editorProject })
    }

    setEditorProjects([ ...nEditorProjects ])
}

//TODO: Rehydrate the connecting css edges
function rehydrateQuantaProject(data: IQuantaProjectData, iconDict: any) {
    let dataClone = data
    let store = dataClone.store
    if(store === undefined)
        store = { selectors: [], editorProjects: [] }

    let editorProjects = store.editorProjects
    if(editorProjects === undefined)
        editorProjects = []

    let newEditorProjects = [] as IQuantaEditorProject[]
    for(let i = 0; i < editorProjects.length; i++) {
        let editorProject = editorProjects[i]
        let quantaStore = editorProject.quantaStore

        let executionResults = editorProject.executionResults
        for(let x = 0; x < executionResults.length; x++) {
            let executionResult = executionResults[x]
            let computedSockets = executionResult.computedSockets

            let nComputedSockets = []
            for(let z = 0; z < computedSockets.length; z++) {
                let computedSocket = computedSockets[z]
                let socketType = computedSocket.type?.typeId

                if(socketType === "sdmx_field")
                    computedSocket.icon = iconDict["stack_2"]
            }
        }

        let storeKeys = Object.keys(quantaStore)
        for(let x = 0; x < storeKeys.length; x++) {
            let storeKey = storeKeys[x]
            let storeItem = quantaStore[storeKey]
            
            let storeItems = storeItem.items
            if(storeItems === undefined)
                continue

            for(let z = 0; z < storeItems.length; z++) {
                let quantaStoreItem = storeItems[z]
                let frozenData = quantaStoreItem.frozenData
                if(frozenData === undefined)
                    continue

                let parsedData = JSON.parse(frozenData)
                //checking for icon
                if(parsedData.icon !== undefined) {
                    let type = parsedData.type
                    if(type === undefined)
                        continue

                    if(type.typeId === "xml" || type.typeId === "xsd")
                        parsedData.icon = iconDict["file"]
                }

                quantaStoreItem.data = parsedData
                storeItems[z] = quantaStoreItem
            }

            storeItem.items = storeItems
            quantaStore[storeKey] = storeItem
        }

        editorProject.quantaStore = quantaStore
        newEditorProjects.push(editorProject)
    }

    store.editorProjects = newEditorProjects
    dataClone.store = store
    return { ...dataClone }
}

function dehydrateQuantaProject(data: IQuantaProjectData) : IQuantaProjectData {
    let store = data.store
    if(store === undefined)
        store = { selectors: [], editorProjects: [] }

    let editorProjects = store.editorProjects
    if(editorProjects === undefined)
        editorProjects = []

    let newEditorProjects = [] as IQuantaEditorProject[]
    for(let i = 0; i < editorProjects.length; i++) {
        let editorProject = editorProjects[i]
        let quantaStore = editorProject.quantaStore

        let storeKeys = Object.keys(quantaStore)
        for(let x = 0; x < storeKeys.length; x++) {
            let storeKey = storeKeys[x]
            let storeItem = quantaStore[storeKey]
            
            let storeItems = storeItem.items
            if(storeItems === undefined)
                continue

            for(let z = 0; z < storeItems.length; z++) {
                let quantaStoreItem = storeItems[z]
                let frozenData = JSON.stringify(quantaStoreItem.data)
                quantaStoreItem.frozenData = frozenData

                storeItems[z] = quantaStoreItem
            }

            storeItem.items = storeItems
            quantaStore[storeKey] = storeItem
        }

        editorProject.quantaStore = quantaStore
        newEditorProjects.push(editorProject)
    }

    let dataClone = data
    store.editorProjects = newEditorProjects
    dataClone.store = store

    return { ...dataClone }
}

async function SaveQuantaProject(
    token: string,
    organizationId: string,
    projectId: string,
    projectData: IQuantaProjectData | undefined,
    editorProjects: IQuantaEditorProject[],
    schemas: ProjectSchemas[],
    selectors: IQuantaSelector[],
    categorization: IQuantaCategorization | undefined
) {
    if(projectData === undefined)
        return
    if(projectData.store === undefined)
        projectData.store = { selectors: [], editorProjects }

    projectData.store.editorProjects = editorProjects
    projectData.store.selectors = selectors
    projectData.store.categorization = categorization
    projectData.dataset_schema = schemas
    let dehydrated = dehydrateQuantaProject(projectData)
    await UpdateProject(token, organizationId, projectId, dehydrated)
}

export { 
    GetEditorProjects,
    SetEditorProjectData,
    SaveQuantaProject,
    SetEditorExecutionData,
    rehydrateQuantaProject 
}