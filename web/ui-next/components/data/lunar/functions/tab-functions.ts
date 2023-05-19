import { Dispatch, SetStateAction } from "react"
import { v4 } from "uuid"
import { ILunarProjectData, ILunarTab, ILunarUIData, IProjectNode } from "../types/types"
import { GetItem } from "./util-functions"

function TabOpen(id: string, tabs: ILunarTab[]): ILunarTab | null {
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.linked_node_id === id)
            return tab
    }

    return null
}

function SwitchTab(
    ui: ILunarUIData, 
    data: ILunarProjectData | null,
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>, 
    id: string, 
) {
    let nUi = ui
    let tabs = nUi.tabs
    let tab = null
    if(data === null)
        return

    for(let i = 0; i < tabs.length; i++) {
        let tab_ = tabs[i]
        if(tab_.tab_id === id)
            tab = tab_
    }

    if(tab !== null) {
        let node = GetItem(tab.linked_node_id, data.splits)
        if(node === null)
            return

        nUi.activeTab = tab.tab_id
        nUi.visual_id = node.node_id
        nUi.visual_type = node.node_type
    }

    setUI({ ...nUi })
}

function CloseTab(
    ui: ILunarUIData,
    data: ILunarProjectData | null,
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>,
    tabId: string
) {
    if(data === null)
        return

    let nUi = ui
    let tabs = []
    let leftTabId = null

    for(let i = 0; i < nUi.tabs.length; i++) {
        let tab = nUi.tabs[i]
        if(tab.tab_id === tabId) {
            if(tabId === nUi.activeTab) {
                if(nUi.tabs.length > i + 1)
                    leftTabId = nUi.tabs[i + 1].tab_id
                else if(i === nUi.tabs.length - 1 && i > 0)
                    leftTabId = nUi.tabs[i - 1].tab_id
            }

            continue
        }

        tabs.push(tab)
    }

    nUi.tabs = tabs
    nUi.visual_id = ui.active_id
    nUi.visual_type = ui.active_type

    setUI({ ...nUi })

    if(leftTabId !== null)
        SwitchTab(nUi, data, setUI, leftTabId)
}

function CreateTabFromNode(node: IProjectNode) {
    let nTab = {} as ILunarTab
    nTab.linked_node_id = node.node_id
    nTab.tab_name = node.node_name
    nTab.tab_type = node.node_type as "chart" | "document"
    nTab.tab_id = v4()

    return nTab
}

function CreateTab(
    ui: ILunarUIData, 
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>, 
    nTab: ILunarTab
) {
    let nUi = ui
    let tabs = ui.tabs
    tabs.push(nTab)

    nUi.tabs = tabs
    setUI({ ...nUi })
}

export {
    TabOpen,
    CreateTab,
    CloseTab,
    SwitchTab,
    CreateTabFromNode
}