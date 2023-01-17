import { Dispatch, SetStateAction } from "react"
import { v4 } from "uuid"
import { ITreeNode } from "../../../../tree/tree"
import { ILunarProjectData, ILunarTab, ILunarUIData, IProjectNode } from "../../types"
import { CreateTab, CreateTabFromNode, SwitchTab, TabOpen } from "./tab-functions"

function GetItem(id: string, splits: Array<IProjectNode>): IProjectNode | null {
    let item: IProjectNode | null = null
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        if(split.node_id === id)
            return split

        item = GetItem(id, split.children)
    }

    return item
}

function GetTreeItem(id: string | null, nodes?: Array<ITreeNode>): ITreeNode | null {
    let item: ITreeNode | null = null
    if(nodes === undefined || id === null)
        return null

    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if(node.node_id === id)
            return node

        item = GetTreeItem(id, node.children)
    }

    return item
}

function SetDataNodes(
    data: ILunarProjectData | null, 
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    nodes: ITreeNode[]
) {
    if(data === null)
        return

    let nData = data
    nData.nodes = nodes
    setData({ ...nData })
}

function SetItem(node: IProjectNode, splits: Array<IProjectNode>) {
    let nSplits = []
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        split.children = SetItem(node, split.children)

        if(split.node_id === node.node_id)
            nSplits.push(node)
        else
            nSplits.push(split)
    }

    return nSplits
}

function SetItemWrapper(
    data: ILunarProjectData | null, 
    setData: (value: SetStateAction<ILunarProjectData | null>) => void,
    node: IProjectNode, 
) {
    if(data === null)
        return
    let nData = data
    let nSplits = SetItem(node, nData.splits)

    nData.splits = nSplits
    setData({ ...nData })
}

function GetNodeIdFromTab(ui: ILunarUIData, tabId: string): string | null {
    let tabs = ui.tabs
    let nodeId = null
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.tab_id === tabId)
            nodeId = tab.linked_node_id
    }

    return nodeId
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

function SetActiveItem(
    ui: ILunarUIData | null, 
    data: ILunarProjectData | null,
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>,
    nodeId: string, 
    nodeType: string
) {
    if(ui === null)
        return

    let nUi = ui
    let updateActiveUiItemFlag = true

    let tabId = null
    let tabFunction = "switch" as "create" | "switch"

    if(nodeType === "chart" || nodeType === "document") {
        updateActiveUiItemFlag = false
        let openTab = TabOpen(nodeId, nUi.tabs)

        if(openTab === null)
            tabFunction = "create"
        else
            tabId = openTab.tab_id
    }

    if(updateActiveUiItemFlag === true) {
        nUi.active_id = nodeId
        nUi.active_type = nodeType 
        nUi.visual_id = nodeId
        nUi.active_type = nodeType
    }

    setUI({ ...nUi })

    if(tabFunction === "switch" && tabId !== null)
        SwitchTab(ui, data, setUI, tabId)
    if(tabFunction === "create" && updateActiveUiItemFlag == false) {
        if(data === null)
            return
        let node = GetItem(nodeId, data.splits)
        if(node === null)
            return

        let n_tab = CreateTabFromNode(node)
        CreateTab(ui, setUI, n_tab)
        SwitchTab(ui, data, setUI, n_tab.tab_id)
    }
}

export {
    GetItem,
    SetItem,
    GetNodeIdFromTab,
    GetTreeItem,
    SetDataNodes,
    SetItemWrapper,
    IdExists,
    SetActiveItem
}