import { Dispatch, SetStateAction } from "react"
import { ILunarTab, ILunarUIData } from "../../types"

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

function CloseTab(
    ui: ILunarUIData, 
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>,
    tabId: string
) {
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
    setUI({ ...nUi })

    if(leftTabId !== null)
        ChangeTab(ui, setUI, leftTabId, nUi.tabs)
}

function CreateTab(
    ui: ILunarUIData, 
    setUI: Dispatch<SetStateAction<ILunarUIData | null>>, 
    nTab: ILunarTab
) {

}

export {
    TabOpen,
    ChangeTab,
    CreateTab,
    CloseTab
}