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
    SetDataNodes, 
    CloseTab,
    SetItemWrapper,
    SetActiveItem,
    SwitchTab
} from "./functions"

import { ITreeNode } from "../../../tree/tree"

interface ILunarContextProps {
    pkg: IAddIndicatorData
    children?: JSX.Element | never[]
}

const LunarContextData = createContext<ILunarState | null>(null)

const LunarContext: React.FC<ILunarContextProps> = ({ children, pkg }) => {
    const [data, setData] = useState<ILunarProjectData | null>(null)
    const [ui, setUI]     = useState<ILunarUIData | null>(null)

    //sets the context's default state
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

    //sets the active item based on the id and type

    //opens a modal based on the modals id
    function OpenModal(id: string) {
        let n_ui = ui as ILunarUIData
        n_ui.explorer_modal = id
        setUI({ ...n_ui })
    }

    //univsersal close function for modal
    function CloseModal() {
        let n_ui = ui as ILunarUIData
        n_ui.explorer_modal = undefined
        setUI({ ...n_ui })
    }

    //prune the tabs once the node list has changed
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

    //project functions
    const deleteProject = (id: string, type: string) => 
        DeleteProjectItemWrapper(data, ui, setData, setUI, id, type)
    const createProject = ( pId: string, name: string, type: string ) => 
        CreateProjectItemWrapper(ui, data, setData, setUI, pId, name, type)

    //sidebar node functions
    const idExists = ( id: string ) => data ? IdExists(data.splits, id) : false
    const createSettings = (id: string) => CreateSettings(data, setData, id)
    const getNodeIdTab = (id: string) => GetNodeIdFromTab(ui!, id)
    const getNode = (id: string) => data ? GetItem(id, data.splits) : null
    const setNode = (node: IProjectNode) => SetItemWrapper(data, setData, node)
    const createIndicatorSetting = (id: string, setting: IIndicatorSetting) => 
        CreateIndicatorSetting(data, setData, id, setting)
    const setDataNodes = (nodes: ITreeNode[]) => SetDataNodes(data, setData, nodes)
    const setActiveItem = (id: string, type: string) =>
        SetActiveItem(ui, data, setUI, id, type)

    //tab functions
    const changeTab = (id: string) => SwitchTab(ui!, data, setUI, id)
    const closeTab = (tabId: string) => CloseTab(ui!, data, setUI, tabId)

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
                setActiveItem: setActiveItem,
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
                setNode,
                closeTab
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