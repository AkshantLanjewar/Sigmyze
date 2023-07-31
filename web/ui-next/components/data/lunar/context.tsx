import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { 
    ILunarState, 
    ILunarProjectData, 
    IProjectNode,
    ILunarUIData, 
    ILunarTab,
    IIndicatorSetting
} from "./types/types"

import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_PROJECT } from "./types/types"
import { EnumerateNodes } from "./utils"

import ExplorerModal from "../../lunar/explorer-modals/explorer-modals"
import { IAddIndicatorData } from "../../lunar/explorer-modals/add-indicator"
import { IIndicator } from "../datasets/DatasetsTypes"
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
    SwitchTab,
    GrabDocument,
    SetDocument,
    AddQuantaIndicator,
    DeleteQuantaIndicator,
    GetQuantaIndicatorSetting
} from "./functions/functions"

import { ITreeNode } from "../../tree/tree"
import { useRouter } from "next/router"
import { GetProject, UpdateProject } from "./lunar-api"
import { UserContextData } from "../user/context"
import { IUserContext } from "../user/types"
import { usePrevious } from "@mantine/hooks"
import { IDocument } from "./types/document-types"
import { IQuantaIndicatorShell } from "../../ui/quanta-dataset-manager/types"

interface ILunarContextProps {
    pkg: IAddIndicatorData
    children?: JSX.Element | never[]
}

const LunarContextData = createContext<ILunarState | null>(null)

const LunarContext: React.FC<ILunarContextProps> = ({ children, pkg }) => {
    const [data, setData] = useState<ILunarProjectData | null>(null)
    const [ui, setUI]     = useState<ILunarUIData | null>(null)

    const [toggleUpdate, setToggleUpdate] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [custom, setCustom] = useState(false)

    /**
     * @description
     *  this function toggles the drive update switch
     *  updating the data on the server if the user 
     *  is logged in. 
     * @returns void
     */
    const updateDrive = () => setToggleUpdate(!toggleUpdate)

    const { loggedIn, authData } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    /**
     * @async
     * @listens toggleUpdate
     * @description
     *  This is the effect that listens and updates when it is toggled.
     *  It only sends a request to the database if the user is logged in
     *  and the inital data has already been loaded.
     */
    useEffect(() => {
        //save the project
        if(data === null)
            return
        if(loaded === false)
            return
        if(loggedIn !== true && router.query.ids?.length && router.query.ids.length > 0)
            window.location.replace('/lunar')
        if(loggedIn !== true)
            return

        async function update() {
            let token = authData?.token
            if(token === undefined)
                return

            let ids = router.query.ids as string[] | undefined
            if(ids === undefined || ids.length === 0)
                return

            let organizationId = ids[0]
            let projectId = ids[1]
            await UpdateProject(token, organizationId, projectId, data!)
        }

        update()
    }, [toggleUpdate])

    /**
     * @description
     *  This function creates the default project from the types file.
     */
    function defaultProject() {
        let default_project    = DEFAULT_PROJECT
        default_project.splits = EnumerateNodes(default_project.splits) 
        let defaultUi = buildUi(default_project)

        setData({ ...default_project })
        setUI({ ...defaultUi })
        setLoaded(true)
    }

    /**
     * @description
     *  this function builds the ui object based off of the project given to it
     * @param {ILunarProjectData} project This is the project the default ui needs to build around
     * @returns {ILunarUIData} ILunarUIData
     */
    function buildUi(project: ILunarProjectData) {
        let defaultUi = {} as ILunarUIData
        defaultUi.active_id = project.splits[0].node_id
        defaultUi.active_type = project.splits[0].node_type
        defaultUi.visual_id = project.splits[0].node_id
        defaultUi.visual_type = project.splits[0].node_type
        defaultUi.explorer_modal = null
        defaultUi.tabs = []
        defaultUi.activeTab = null

        return defaultUi
    }

    /**
     * @async
     * @borrows token(UserContext)
     * @description 
     *  this function loads the project into the context memory.
     *  If it is unable to find the url paramters, then it loads the default
     *  project into memory. Otherwise it requests that the project be loaded
     *  from the database.
     * @returns void
     */
    async function loadProject() {
        if(loaded)
            return

        let ids = router.query.ids as string[] | undefined
        if(ids === undefined || ids.length !== 2) {
            defaultProject()
            return
        }

        let token = authData?.token
        if(token === undefined) {
            return
        }

        let organizationId = ids[0]
        let projectId = ids[1]
        
        let project = await GetProject(token, organizationId, projectId)
        if(project !== undefined) {
            project.splits = EnumerateNodes(project.splits)
            let ui = buildUi(project)

            setData({ ...project })
            setUI({ ...ui })
            setLoaded(true)
            setCustom(true)
        }
    }

    /**
     * @description
     *  this is the effect that loads the data into the context.
     *  If the authentication data has not been loaded from localstate
     *  @listens authData
     */
    useEffect(() => {
        if(authData === null) {
            loadProject()
            return
        }
        if(authData === undefined && router.query.ids !== undefined) {
            window.location.replace('/lunar')
            return
        }

        loadProject()
    }, [authData])

    //sets the active item based on the id and type

    /**
     * @implements {ILunarState.setExplorerModal}
     */
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
        DeleteProjectItemWrapper(data, ui, updateDrive, setData, setUI, id, type)
    const createProject = ( pId: string, name: string, type: string ) => 
        CreateProjectItemWrapper(ui, data, setData, setUI, pId, name, type, updateDrive)

    //sidebar node functions
    const idExists = ( id: string ) => data ? IdExists(data.splits, id) : false
    const getNodeIdTab = (id: string) => GetNodeIdFromTab(ui!, id)
    const getNode = (id: string) => data ? GetItem(id, data.splits) : null
    const setNode = (node: IProjectNode) => SetItemWrapper(data, setData, node)
    const setDataNodes = (nodes: ITreeNode[]) => SetDataNodes(data, setData, nodes)
    const setActiveItem = (id: string, type: string) =>
        SetActiveItem(ui, data, setUI, id, type)

    //tab functions
    const changeTab = (id: string) => SwitchTab(ui!, data, setUI, id)
    const closeTab = (tabId: string) => CloseTab(ui!, data, setUI, tabId)

    //chart functions
    const createSettings = (id: string) => CreateSettings(data, setData, id, updateDrive)
    const createGlobals = (id: string) => CreateGlobals(data, setData, id, updateDrive)
    const getIndicatorSetting = (id: string, indicator: IIndicator) => GetIndicatorSetting(data, id, indicator)
    const setChartTitle = (id: string, name: string) =>
        SetChartTitle(data, setData, id, name, updateDrive)
    const createIndicatorSetting = (id: string, setting: IIndicatorSetting) => 
        CreateIndicatorSetting(data, setData, updateDrive, id, setting)

    const addIndicator = ( id: string, indicator: IIndicator ) =>
        AddIndicator(data, setData, id, indicator, updateDrive)
    const deleteIndicator = (id: string, indicator: IIndicator) =>
        DeleteIndicator(data, setData, id, indicator, updateDrive)

    //quanta indicator counterparts (moving over to quanta system, delete unsused code next update cycle)
    const addQuantaIndicator = useCallback(( id: string, indicator: IQuantaIndicatorShell ) => {
        return AddQuantaIndicator(data, setData, id, indicator)
    }, [data])

    const deleteQuantaIndicator = useCallback((id: string, indicator: IQuantaIndicatorShell) => {
        return DeleteQuantaIndicator(data,setData, id, indicator, updateDrive)
    }, [data, updateDrive])

    const getQuantaIndicatorSetting = useCallback((id: string, indicator: IQuantaIndicatorShell) => {
        return GetQuantaIndicatorSetting(data, id, indicator)
    }, [data])

    //document functions
    const grabDocument = (documentId: string) =>
        GrabDocument(JSON.parse(JSON.stringify(data)), setData, updateDrive, documentId)
    const setDocument = (documentId: string, documentData: IDocument) =>
        SetDocument(data, setData, updateDrive, documentId, documentData)

    return (
        <>
            <LunarContextData.Provider value={{ 
                data, 
                ui,
                loaded,
                custom,
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
                getQuantaIndicatorSetting,
                createIndicatorSetting,
                deleteIndicator,
                createGlobals,
                setChartTitle,
                getNode,
                setDataNodes,
                setNode,
                closeTab,
                toggleDriveUpdate: updateDrive,
                grabDocument,
                setDocument,
                addQuantaIndicator,
                deleteQuantaIndicator
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