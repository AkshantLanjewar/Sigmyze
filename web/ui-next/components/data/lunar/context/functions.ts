import { Dispatch, SetStateAction } from "react";
import { ILunarProjectData, ILunarTab, ILunarUIData, IProjectNode, IProjectNodeData } from "../types";
import { v4 as uuidv4 } from "uuid";
import { GetItem, SetItem, GetNodeIdFromTab } from "./util-functions"


export { 
    AddIndicator, 
    DeleteIndicator,
    CreateSettings, 
    GetIndicatorSetting, 
    CreateIndicatorSetting,
    CreateGlobals,
    SetChartTitle,
    CompareIndicators 
} from "./chart-functions"

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
    setData: (value: SetStateAction<ILunarProjectData | null>) => void, 
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
        node_id: uuidv4(),
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

function IdExists(splits: Array<IProjectNode>, id: string): boolean {
    if(splits === undefined)
        return false

    let exists = false
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        if(split.node_id === id)
            return true

        exists = IdExists(split.children, id)
    }

    return exists
}

function TabOpen(id: string, tabs: ILunarTab[]): ILunarTab | null {
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.linked_node_id === id)
            return tab
    }

    return null
}

function ChangeTab(
    ui: ILunarUIData, 
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>, 
    id: string, 
    tabs: ILunarTab[]
): void {
    let realTab = false
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.tab_id === id)
            realTab = true
    }

    let nUI = ui
    if(realTab) {
        nUI.activeTab = id
    }   

    setUI({ ...nUI })
}

export { 
    DeleteProjectItemWrapper,
    CreateProjectItemWrapper,
    IdExists,
    TabOpen,
    GetItem,
    SetItem,
    GetNodeIdFromTab,
    ChangeTab,
}