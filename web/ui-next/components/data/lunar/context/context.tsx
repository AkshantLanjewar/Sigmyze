import { createContext, useState, useEffect } from "react"
import { 
    ILunarState, 
    ILunarProjectData, 
    IProjectNode,
    ILunarUIData, 
    ILunarTab,
    IIndicatorSetting
} from "../types"

import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_PROJECT } from "../types"
import { EnumerateNodes } from "../utils"

import ExplorerModal from "../../../lunar/explorer-modals/explorer-modals"
import { IAddIndicatorData } from "../../../lunar/explorer-modals/add-indicator"
import { IIndicator } from "../../datasets/DatasetsTypes"
import { 
    AddIndicator, 
    ChangeTab, 
    CreateGlobals, 
    CreateIndicatorSetting, 
    CreateProjectItemWrapper, 
    CreateSettings, 
    DeleteIndicator, 
    DeleteProjectItemWrapper, 
    GetIndicatorSetting, 
    GetItem, 
    GetNodeIdFromTab, 
    IdExists, 
    SetChartTitle, 
    TabOpen,
    SetDataNodes 
} from "./functions"
import { GetTreeItem, SetItemWrapper } from "./util-functions"
import { ITreeNode } from "../../../tree/tree"

interface ILunarContextProps {
    pkg: IAddIndicatorData
    children?: JSX.Element | never[]
}

const LunarContextData = createContext<ILunarState | null>(null)

const LunarContext: React.FC<ILunarContextProps> = ({ children, pkg }) => {
    const [data, setData] = useState<ILunarProjectData | null>(null)
    const [ui, setUI]     = useState<ILunarUIData | null>(null)

    useEffect(() => {
        let default_project    = DEFAULT_PROJECT
        default_project.splits = EnumerateNodes(default_project.splits) 

        let defaultUi = {} as ILunarUIData
        defaultUi.active_id = default_project.splits[0].node_id
        defaultUi.active_type = default_project.splits[0].node_type
        defaultUi.visual_id = default_project.splits[0].node_id
        defaultUi.visual_type = default_project.splits[0].node_type
        defaultUi.explorer_modal = null
        defaultUi.tabs = []
        defaultUi.activeTab = null

        setData({ ...default_project })
        setUI({ ...defaultUi })
    }, [])

    // handles deleting of a project from the context state
    // ex deleting a folder, chart, or document

    //handles the creation of a new project item

    //handles the ui state
    function SetActiveItem(id: string, type: string) {
        let updateActiveFlag = true
        let n_ui = ui as ILunarUIData

        n_ui.visual_id = id
        n_ui.visual_type = type
        if(type === "chart" || type === "document") {
            updateActiveFlag = false

            //check if there isa tab open
            let open_tab = TabOpen(id, n_ui.tabs)
            if(open_tab === null) {
                let node  = GetItem(id, data!.splits)

                if(node !== null) {
                    let n_tab = {} as ILunarTab
                    n_tab.linked_node_id = id
                    n_tab.tab_type = type
                    n_tab.tab_name = node.node_name
                    n_tab.tab_id = uuidv4()

                    n_ui.tabs.push(n_tab)
                    n_ui.activeTab = n_tab.tab_id
                }                
            } else {
                //find the tab
                for(let i = 0; i < n_ui.tabs.length; i++) {
                    let tab = n_ui.tabs[i]
                    if(tab.linked_node_id === id)
                        n_ui.activeTab = tab.tab_id
                }
            }
        }
        
        if(updateActiveFlag) {
            n_ui.active_id = id
            n_ui.active_type = type 
        }
        
        setUI({ ...n_ui })
    }

    function OpenModal(id: string) {
        let n_ui = ui as ILunarUIData
        n_ui.explorer_modal = id
        setUI({ ...n_ui })
    }

    function CloseModal() {
        let n_ui = ui as ILunarUIData
        n_ui.explorer_modal = undefined
        setUI({ ...n_ui })
    }

    useEffect(() => {
        let activeTab = ui?.activeTab
        let tabs = ui?.tabs
        if(activeTab === null || activeTab === undefined || tabs === undefined)
            return

        //check if the node is active
        let tab = null
        for(let i = 0; i < tabs.length; i++) {
            let tab_ = tabs[i]
            if(tab_.tab_id === activeTab)
                tab = tab_
        }

        if(tab === null)
            return
        let nodeId = tab.linked_node_id
        let node = data ? GetItem(nodeId, data.splits) : null
        if(node === null)
            return

        let nUi = ui!
        nUi.visual_id = nodeId
        nUi.visual_type = node.node_type
        setUI({ ...nUi })
    }, [ui?.activeTab])

    //prune the tabs
    useEffect(() => {
        let tabs = ui?.tabs
        if(tabs === undefined)
            return
        if(data?.nodes === undefined)
            return
        
        let nodes = data.splits
        let nTabs = []
        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            let nodeId = tab.linked_node_id

            let node = GetItem(nodeId, nodes)
            if(node !== null)
                nTabs.push(tab)
        }

        let nUi = ui!
        nUi.tabs = nTabs
        setUI({ ...nUi })
    }, [data?.nodes])

    const deleteProject = (id: string, type: string) => DeleteProjectItemWrapper(data, setData, id, type)
    const createProject = ( pId: string, name: string, type: string ) => 
        CreateProjectItemWrapper(data, setData, pId, name, type)
    const idExists = ( id: string ) => data ? IdExists(data.splits, id) : false
    const changeTab = ( id: string ) => ChangeTab(ui!, setUI, id, ui!.tabs)
    const createSettings = (id: string) => CreateSettings(data, setData, id)
    const getNodeIdTab = (id: string) => GetNodeIdFromTab(ui!, id)
    const getNode = (id: string) => data ? GetItem(id, data.splits) : null
    const setNode = (node: IProjectNode) => SetItemWrapper(data, setData, node)
    const createIndicatorSetting = (id: string, setting: IIndicatorSetting) => 
        CreateIndicatorSetting(data, setData, id, setting)
    const setDataNodes = (nodes: ITreeNode[]) => SetDataNodes(data, setData, nodes)

    //chart functions
    const createGlobals = (id: string) => CreateGlobals(data, setData, id)
    const getIndicatorSetting = (id: string, indicator: IIndicator) => GetIndicatorSetting(data, id, indicator)
    const setChartTitle = (id: string, name: string) =>
        SetChartTitle(data, setData, id, name)
    const addIndicator = ( id: string, indicator: IIndicator ) =>
        AddIndicator(data, setData, id, indicator)
    const deleteIndicator = (id: string, indicator: IIndicator) =>
        DeleteIndicator(data, setData, id, indicator)

    //document functions

    return (
        <>
            <LunarContextData.Provider value={{ 
                data, 
                ui,
                deleteProject: deleteProject, 
                createProject: createProject,
                setActiveItem: SetActiveItem,
                setExplorerModal: OpenModal,
                addIndicator: addIndicator,
                idExists: idExists,
                changeTab: changeTab,
                createSettings: createSettings ,
                getNodeIdTab: getNodeIdTab,
                getIndicatorSetting,
                createIndicatorSetting,
                deleteIndicator,
                createGlobals,
                setChartTitle,
                getNode,
                setDataNodes,
                setNode
            }}>
                <div style={{ width: "100%", height: "100%" }}>
                    {ui !== null && (
                        <ExplorerModal 
                            modalState={ui.explorer_modal}
                            close={CloseModal}
                            pkg={pkg}
                        />
                    )}

                    {children}
                </div>
            </LunarContextData.Provider>
        </>
    )
}

export { LunarContextData }
export default LunarContext