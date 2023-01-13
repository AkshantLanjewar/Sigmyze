import { ILunarUIData, IProjectNode } from "../types"

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

export {
    GetItem,
    SetItem,
    GetNodeIdFromTab
}