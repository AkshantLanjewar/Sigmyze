import { SetStateAction } from "react"
import { v4 } from "uuid"
import { ILunarProjectData, ILunarUIData, IProjectNode } from "../../types"

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

function DeleteProjectItemWrapper(
    data: ILunarProjectData | null, 
    ui: ILunarUIData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void, 
    setUI: (value: SetStateAction<ILunarUIData | null>) => void,
    id: string, 
    type: string
): void {
    if(data == null)
        return

    let project_splits = data.splits ? data!.splits : []
    project_splits     = DeleteProjectItem(project_splits, id, type)
    
    let nData = data
    nData.splits = project_splits
    setData({ ...nData })

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
}

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

function CreateProjectItemWrapper(
    data: ILunarProjectData | null,
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    parent_id: string, 
    name: string, 
    type: string
): void {
    if(data == null)
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
}

export {
    CreateProjectItemWrapper,
    DeleteProjectItemWrapper
}