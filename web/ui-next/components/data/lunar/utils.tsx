import { VscNewFolder, VscNewFile } from 'react-icons/vsc'
import { BiChart } from 'react-icons/bi'
import { IContextMenuItem, ITreeNode, ITreeNodeData } from "../../tree/tree"
import { IconDoorEnter, IconTrash } from "@tabler/icons"

import { 
    IProjectNodeAction, 
    IProjectNode,
    deleteProject,
    createProject,
    idVoid,
    addIndicator
} from "./types"

import { chartMenu, documentMenu, folderMenu, indicatorMenu } from './menu-templates'

let project_actions = [
    {
        name: "Add Folder",
        cb: () => {  },
        icon: <VscNewFolder size={16} aria-label={"side-ico"} />
    } as IProjectNodeAction,
    {
        name: "Add Document",
        icon: <VscNewFile size={16} aria-label={"side-ico"} />,
        cb: () => {      }
    } as IProjectNodeAction,
    {
        name: "Add Chart",
        icon: <BiChart size={16} aria-label={"side-ico"} />,
        cb: () => {  }
    } as IProjectNodeAction,
]

let chart_actions = [
    {
        name: "Open",
        icon: <IconDoorEnter size={16} aria-label={"side-ico"} />,
        cb: () => {  }
    } as IProjectNodeAction,
    {
        name: "Delete",
        icon: <IconTrash size={16} aria-label={"side-ico"} />,
        cb: () => {  }
    } as IProjectNodeAction
]

function EnumerateNodes(splits: Array<IProjectNode>): Array<IProjectNode> {
    let nSplits: Array<IProjectNode> = []
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        let split_type = split.node_type

        switch(split_type) {
            case "project":
                split['actions'] = project_actions
                break
            case "chart":
                split['data']    = {}
                split['actions'] = chart_actions
                break
        }

        split.children = EnumerateNodes(split.children)
        nSplits.push(split)
    }

    return nSplits
}

interface IActionFunctions {
    deleteProject?: deleteProject,
    createProject?: createProject,
    setExplorerModal?: idVoid,
    deleteIndicator?: addIndicator
}

function GenerateActions(id: string, type: string, actions: IActionFunctions): IProjectNodeAction[] {
    let nActions    = [] as IProjectNodeAction[]
    let iterActions = [] as IProjectNodeAction[]

    if(type === "chart" || type === "document")
        iterActions = [...chart_actions]
    if(type === "project")
        iterActions = project_actions
    if(type === "folder")
        iterActions = [...project_actions, chart_actions[1]]

    for(let i = 0; i < iterActions.length; i++) {
        let action  = iterActions[i]
        let nAction = {} as IProjectNodeAction  

        if(action.name === "Delete" && actions.deleteProject !== undefined)
            nAction.cb = () => { actions.deleteProject!(id, type) }
        if(action.name === "Add Folder" && actions.createProject !== undefined)
            nAction.cb = () => { actions.setExplorerModal!("folder") }
        if(action.name === "Add Document" && actions.createProject !== undefined)
            nAction.cb = () => { actions.setExplorerModal!("document") }
        if(action.name === "Add Chart" && actions.createProject !== undefined)
            nAction.cb = () => { actions.setExplorerModal!("chart") }
        if(action.name === "Open")
            nAction.cb = () => {  }
        
        nAction.name = action.name
        nAction.icon = action.icon
        nActions.push(nAction)
    }

    return nActions
}

function HydrateContextItems(
    items: Array<IContextMenuItem>, 
    actions: IActionFunctions, 
    id: string,
    data?: ITreeNodeData
) {
    let nItems = [] as Array<IContextMenuItem>
    for(let i = 0; i < items.length; i++) {
        let item = items[i]
        
        let nItem = {} as IContextMenuItem
        nItem.icon = item.icon
        nItem.name = item.name
        nItem.type = item.type

        switch(item.name) {
            case "Create Folder":
                nItem.cb = () => { actions.setExplorerModal!("folder") }
                break
            case "Create Document":
                nItem.cb = () => { actions.setExplorerModal!("document") }
                break
            case "Create Chart":
                nItem.cb = () => { actions.setExplorerModal!("chart") }
                break
            case "Delete Folder":
                nItem.cb = () => { actions.setExplorerModal!("folder_delete") }
                break
            case "Delete Chart":
                nItem.cb = () => { actions.setExplorerModal!("chart_delete") }
                break
            case "Delete Document":
                nItem.cb = () => { actions.setExplorerModal!("document_delete") }
                break
            case "Add Indicator":
                nItem.cb = () => { actions.setExplorerModal!("add_indicator") }
                break
            case "Delete Indicator":
                if(data === undefined || data.indicator === undefined)
                nItem.cb = () => {  }

                let indicator = data!.indicator!
                nItem.cb = () => { actions.deleteIndicator!(id, indicator) }
                break
            default:
                nItem.cb = () => {  }
                break
        }

        nItems.push(nItem)
    }

    return nItems
}

function ConvertToTree(splits: Array<IProjectNode>, actions: IActionFunctions): Array<ITreeNode> {
    let nNodes: Array<ITreeNode> = []
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        let node  = {} as ITreeNode

        node['node_id'] = split.node_id
        node['node_title'] = split.node_name
        node['node_type'] = split.node_type
        node['actions'] = split.actions ? split.actions : []

        if(split.node_type !== "project")
            node['context'] = true
        switch(split.node_type) {
            case "folder":
                node['contextItems'] = HydrateContextItems(folderMenu, actions, node.node_id)
                break
            case "chart":
                node['contextItems'] = HydrateContextItems(chartMenu, actions, node.node_id)
                break
            case "document":
                node['contextItems'] = HydrateContextItems(documentMenu, actions, node.node_id)
                break
        }

        node['actions']  = GenerateActions(split.node_id, split.node_type, actions)
        node['children'] = ConvertToTree(split.children, actions)
        if(split.node_type === "chart") {
            node['useActive'] = true
            let indicators = split.data!.indicators
            if(indicators !== undefined) {
                for(let i = 0; i < indicators.length; i++) {
                    let indicator = indicators[i]
                    let indicator_child = {
                        node_id: `${node.node_id}-${indicator.object.object_id}:${indicator.indicator.indicator_id}`,
                        node_type: 'indicator',
                        node_title: `${indicator.object.object_id}:${indicator.indicator.indicator_id}`,

                        data: {
                            indicator: indicator
                        },
    
                        opened: true,
                        useActive: true,
                        context: true,
                    } as ITreeNode

                    indicator_child['contextItems'] = HydrateContextItems(
                        indicatorMenu, 
                        actions, 
                        node.node_id, 
                        indicator_child.data
                    )
    
                    node['children'].push(indicator_child)
                }
            }
        }

        if(split.node_type === "project")
            node['opened'] = true
        else
            node['opened'] = false

        nNodes.push(node)
    }

    return nNodes
}

export { 
    EnumerateNodes, 
    ConvertToTree
}