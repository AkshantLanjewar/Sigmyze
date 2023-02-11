import { SetStateAction } from "react"
import { v4 } from "uuid"
import { ILunarProjectData, ILunarUIData, IProjectNode } from "../types/types"
import { CreateTab, CreateTabFromNode, SwitchTab } from "./tab-functions"
import { GetItem } from "./util-functions"

/**
 * @description
 *  recursive helper to delete item from splits
 * @recursive
 * @param splits
 *  theese are the nodes to iterate through
 * @param id 
 *  the id of the item being deleted
 * @param type
 *  the type of the item being deleted 
 * @returns 
 */
function DeleteProjectItem(splits: Array<IProjectNode>, id: string, type: string) {
    let nNodes = [] as IProjectNode[]
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        if(split.node_id === id)
            continue
        
        let children   = split.children
        split.children = DeleteProjectItem(children, id, type)
        nNodes.push(split)
    }

    return nNodes
}

/**
 * @description
 *  this deletes an item from the project. If it is a document, removes it from 
 *  the repository as well.
 * @param data 
 *  the data for the project
 * @param ui 
 *  ui state for the project
 * @param updateDrive 
 *  updates the server with the data
 * @param setData 
 *  project data setter
 * @param setUI 
 *  project ui setter
 * @param id 
 *  id of the item being deleted
 * @param type 
 *  type of the item being deleted
 * @returns void
 */
function DeleteProjectItemWrapper(
    data: ILunarProjectData | null, 
    ui: ILunarUIData | null,
    updateDrive: () => void,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void, 
    setUI: (value: SetStateAction<ILunarUIData | null>) => void,
    id: string, 
    type: string
): void {
    if(data == null)
        return

    //prune tabs
    let tabs = ui?.tabs
    let nTabs = []
    if(ui === null || tabs === undefined)
        return
    
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.linked_node_id === id)
            continue

        nTabs.push(tab)
    }

    ui.tabs = nTabs
    setUI({ ...ui })

    let project_splits = data.splits ? data!.splits : []
    let node = GetItem(id, project_splits)
    if(node === null)
        return

    let documentId = node.data?.document_id
    project_splits     = DeleteProjectItem(project_splits, id, type)
    
    let nData = data
    nData.splits = project_splits
    if(type === "document") {
        let documents = nData.documents
        if(documents === undefined)
            documents = []

        let nDocuments = []
        for(let i = 0; i < documents.length; i++) {
            let document = documents[i]
            if(document.document_id === documentId)
                continue

            nDocuments.push(document)
        }

        nData.documents = nDocuments
    }

    setData({ ...nData })
    updateDrive()
}
/**
 * @description
 *  this is the recursive wrapper function that creates a new project in lunar.
 * @recursive
 * @param splits 
 *  list of nodes to go throught
 * @param parent_id 
 *  id of the parent where we want to create the item
 * @param node 
 *  the new node being created
 * @returns 
 */
function CreateProjectItem(splits: Array<IProjectNode>, parent_id: string, node: IProjectNode): IProjectNode[] {
    let nNodes = [] as IProjectNode[]
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        if(split.node_id === parent_id)
            split.children.push(node)
        
        let children = split.children
        split.children = CreateProjectItem(children, parent_id, node)
        nNodes.push(split)
    }

    return nNodes
}

/**
 * @description
 *  this creates a new item within the project
 * @param ui 
 *  ui state for window
 * @param data 
 *  current project data
 * @param setData 
 *  project data setter
 * @param setUI 
 *  project ui setter
 * @param parent_id 
 *  parent id of the place we want to create the item
 * @param name 
 *  name of the new item
 * @param type 
 *  type of the new item
 * @param updateDrive 
 *  updates the server
 * @returns void
 */
function CreateProjectItemWrapper(
    ui: ILunarUIData | null,
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    setUI: (value: SetStateAction<ILunarUIData | null>) => void,
    parent_id: string, 
    name: string, 
    type: string,
    updateDrive: () => void,
): void {
    if(data === null)
        return
    if(ui === null)
        return
    
    let nNode = {
        node_id: v4(),
        node_name: name,
        node_type: type,

        children: [],
        actions: [],
        data: {}
    } as IProjectNode

    if(type === "chart") {
        nNode['data']!.indicators = []
    }

    let nData = data
    nData.splits = CreateProjectItem(nData.splits, parent_id, nNode)
    setData({ ...nData })
    updateDrive()

    //create the new tab for the project
    if(type === "chart" || type === "document") {
        let nTab = CreateTabFromNode(nNode)
        CreateTab(ui, setUI, nTab)
        SwitchTab(ui, data, setUI, nTab.tab_id)
    }
}

export {
    CreateProjectItemWrapper,
    DeleteProjectItemWrapper
}