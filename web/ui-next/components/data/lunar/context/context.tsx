import { createContext, useState, useEffect } from "react"
import { 
    ILunarState, 
    ILunarProjectData, 
    IProjectNode,
    ILunarUIData, 
    ILunarTab
} from "../types"

import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_PROJECT } from "../types"
import { EnumerateNodes } from "../utils"

import ExplorerModal from "../../../lunar/explorer-modals/explorer-modals"
import { IAddIndicatorData } from "../../../lunar/explorer-modals/add-indicator"
import { AddIndicator, ChangeTab, CreateProjectItemWrapper, DeleteProjectItemWrapper, GetItem, IdExists, TabOpen } from "./functions"
import { IIndicator } from "../../datasets/DatasetsTypes"

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
        //console.log(ui)
    }, [ui])

    const deleteProject = (id: string, type: string) => DeleteProjectItemWrapper(data, setData, id, type)
    const createProject = ( pId: string, name: string, type: string ) => 
        CreateProjectItemWrapper(data, setData, pId, name, type)
    const addIndicator = ( id: string, indicator: IIndicator ) =>
        AddIndicator(data, setData, id, indicator)
    const idExists = ( id: string ) => data ? IdExists(data.splits, id) : false
    const changeTab = ( id: string ) => ChangeTab(ui!, setUI, id, ui!.tabs)

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
                changeTab: changeTab 
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