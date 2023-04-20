import { createContext, useContext, useEffect, useState } from "react"
import { IQuantaSchema } from "../../quanta/schema-editor/types"
import ModalManager from "../../ui/modal-manager"
import { IQuantaState } from "./types"
import { IQuantaEditorProject, IQuantaProjectData, IQuantaSelector, IQuantaSelectorCode, ProjectSchemas } from "./types/project"
import { IQuantaTab } from "./types/ui"
import { DefaultQuantaProject } from "./utils"

import { 
    activateSelector, 
    changeTab, 
    changeText, 
    closeTab, 
    focusTab, 
    openModal, 
    openSelector, 
    createElement, 
    initSchema, 
    editSchema,
    getSchema,
    changeSchema,
    deleteSchema,
    unfocusAllSchema,
    GetEditorProjects,
    SetEditorProjectData,
    SaveQuantaProject,
    SetEditorExecutionData,
    rehydrateQuantaProject,
    newSelector,
    addSelectorSource
} from "./functions"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore, IQuantaTypeRef } from "../../quanta/quanta-editor/types/types"
import NewFieldForm from "./forms/new_field"
import { GetProject } from "./quanta-api"
import { UserContextData } from "../user/context"
import { IUserContext } from "../user/types"
import { INodeExecutionResult } from "../../quanta/quanta-editor/execution-engine/context/types"
import { IconFileCode2, IconStack2 } from "@tabler/icons"
import QuantaIndicatorManager from "../../quanta/quanta-indicator-manager"
import NewSelectorForm from "./forms/new_selector"

interface IQuantaContextProps {
    quantaId: string | null,
    organizationId: string | null,
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ quantaId, organizationId, children }) => {
    const [projectData, setProjectData] = useState<IQuantaProjectData | undefined>(undefined)
    
    //state relating to the tabs
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
    const [tabs, setTabs] = useState<IQuantaTab[]>([] as IQuantaTab[])

    //state for the modal managaer
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    //state for the selector
    const [activeSelector, setActiveSelector] = useState<string | null>(null)

    //the datasets schema
    const [schemas, setSchemas] = useState<ProjectSchemas[]>([])

    const [updateSchema, setUpdateSchema] = useState(false)
    const toggleUpdateSchema = () => setUpdateSchema(!updateSchema)

    const [updateEditorSchema, setUpdateEditorSchema] = useState(false)
    const toggleUpdateEditorSchema = () => setUpdateEditorSchema(!updateEditorSchema)

    const [updateEditorIndicators, setUpdateEditorIndicators] = useState(false)
    const toggleUpdateEditorIndicators = () => setUpdateEditorIndicators(!updateEditorIndicators)

    //store elements
    const [editorProjects, setEditorProjects] = useState<IQuantaEditorProject[]>([])
    //counter to efficiently save data
    const [saveCounter, setSaveCounter] = useState(0)

    //selectors within the project
    const [selectors, setSelectors] = useState<IQuantaSelector[]>([])

    const [selectorUpdated, setSelectorUpdated] = useState(false)
    const toggleSelectorUpdate = () => setSelectorUpdated(!selectorUpdated)

    const { authData } = useContext(UserContextData) as IUserContext

    function saveFunc() {
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return

        SaveQuantaProject(token, organizationId, quantaId, projectData, editorProjects, schemas)
        setSaveCounter(0)
    }

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId, organizationId])

    useEffect(() => {
        toggleSelectorUpdate()
    }, [selectors])

    useEffect(() => {
        //update the editor
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return

        setSaveCounter(saveCounter + 1)
    }, [editorProjects])

    useEffect(() => {
        saveFunc()
    }, [schemas])

    useEffect(() => {        
        let interval: NodeJS.Timer | undefined = undefined
        if(saveCounter !== 50 && saveCounter > 0)
            interval = setInterval(() => {
                saveFunc()
            }, 1000 * 60)
        else
            saveFunc()

        return () => {
            if(interval === undefined)
                return

            clearInterval(interval)
        }
    }, [saveCounter])

    let value: IQuantaState = {} as IQuantaState
    value.project_data = { ...projectData }
    if(value.project_data !== undefined)
        value.project_data.dataset_schema = schemas
    if(value.project_data.store === undefined)
        value.project_data.store = { selectors: [] }

    value.project_data.store.editorProjects = editorProjects
    value.project_data.store.selectors = selectors
    value.editorProjects = editorProjects

    value.updateEditorIndicators
    value.toggleUpdateEditorIndicators = toggleUpdateEditorIndicators

    value.updateEditorSchema = updateEditorSchema
    value.updateSchema = updateSchema
    value.tabId = activeTab
    value.tabs = tabs
    value.activeSelectorId = activeSelector

    value.organizationId = organizationId
    value.quantaId = quantaId
    value.selectorsUpdated = selectorUpdated

    //NOTE: Theese are the functions relating to the context
    
    //NOTE: This function changes the tab to the specified tabs string
    // meant to be used by the mantine component only
    value.changeTab = ( tabId: string ) => 
        changeTab(tabId, activeTab, setActiveTab)

    //Note this function focuses to a tab within the editor
    // creates a tab if it does not exist
    value.focusTab = (fileId: string, fileType: string) => 
        focusTab(fileId, fileType, tabs, projectData, setTabs, setActiveTab)

    //this function closes a tab and context switches appropriately
    value.closeTab = (tabId: string) => 
        closeTab(tabId, tabs, activeTab, setTabs, setActiveTab)

    //this function handles changing a text field
    value.changeText = (text: string, field: "title" | "id" | "desc") =>
        changeText(text, field, projectData, setProjectData)

    //this function opens a modal
    value.openModal = (modalId: string) => 
        openModal(modalId, setModalState)

    //this function activates a selector
    value.activateSelector = (selectorId: string) => 
        activateSelector(selectorId, setActiveSelector)

    //this function opens a selector in the selector view
    value.openSelector = (selectorId: string) => 
        openSelector(selectorId, value, projectData, setActiveSelector)

    value.getSchema = (parentId: string) =>
        getSchema(parentId, schemas)

    value.changeSchema = (parentId: string, nSchema: IQuantaSchema) =>
        changeSchema(parentId, nSchema, schemas, setSchemas, toggleUpdateEditorSchema)

    value.initSchema = (parentId: string) =>
        initSchema(parentId, schemas, setSchemas, toggleUpdateEditorSchema)

    value.createElement = (parentId: string, nodeId: string, fieldName?: string) =>
        createElement(parentId, nodeId, value.getSchema(parentId), fieldName, value.changeSchema, toggleUpdateEditorSchema)

    value.editSchema = (
        parentId: string,
        nodeId: string, 
        type: "edit_text" | "edit_type", 
        text: string, 
        node_type: IQuantaTypeRef | undefined
    ) =>
        editSchema(
            parentId, 
            nodeId, 
            type, 
            text, 
            node_type, 
            value.getSchema(parentId), 
            value.changeSchema, 
            toggleUpdateSchema,
            toggleUpdateEditorSchema
        )

    value.deleteElement = (parentId: string, nodeId: string) =>
        deleteSchema(parentId, nodeId, value.getSchema(parentId), value.changeSchema, toggleUpdateEditorSchema)

    value.unfocusAll = (parentId: string) =>
        unfocusAllSchema(parentId, value.getSchema(parentId), value.changeSchema)

    value.getEditorProject = (fileId: string) =>
        GetEditorProjects(fileId, editorProjects)

    value.setEditorProject = (fileId: string, nodes: IQuantaRFNode[], edges: IQuantaRFEdge[], quantaStore: IQuantaStore, executionResults: INodeExecutionResult[],) =>
        SetEditorProjectData(fileId, nodes, edges, quantaStore, editorProjects, executionResults, setEditorProjects)

    value.setEditorExecution = (fileId: string, executionResults: INodeExecutionResult[]) =>
        SetEditorExecutionData(fileId, executionResults, editorProjects, setEditorProjects)

    //selectors
    value.newSelector = (selectorName: string, selectorId: string) =>
        newSelector(selectorName, selectorId, selectors, setSelectors)

    value.addSelectorSource = (selectorId: string, selectorSource: IQuantaSelectorCode) =>
        addSelectorSource(selectorId, selectorSource, selectors, setSelectors)

    //function that loads the quanta data
    function loadQuanta() {
        if(quantaId === null) {
            let defaultProject = DefaultQuantaProject()
            setProjectData({ ...defaultProject })
            return
        }

        const icon_dict = {
            file: <IconFileCode2 />,
            stack_2: <IconStack2 />
        } as any

        //otherwise load the project from the server
        async function main() {
            let token = authData?.token
            if(organizationId === null || token === undefined)
                return

            let project = await GetProject(token, organizationId, quantaId!)
            if(project === undefined)
                return

            let projectData = project.project_data
            if(projectData === undefined)
                return

            projectData = rehydrateQuantaProject(projectData, icon_dict)
            setProjectData({ ...projectData })
            let schema = projectData.dataset_schema
            if(schema !== undefined)
                setSchemas([ ...schema ])

            let editorProjects = projectData.store?.editorProjects
            if(editorProjects !== undefined)
                setEditorProjects([ ...editorProjects ])

            toggleUpdateSchema()
            toggleUpdateEditorSchema()
        }

        main()
    }

    return (
        <>
            <QuantaContextData.Provider value={value}>
                <QuantaIndicatorManager>
                    <div style={{ width: "100%", height: "100%" }}>
                        <ModalManager
                            modalState={modalState}
                            close={closeModal}
                        >
                            <ModalManager.Modal
                                id="new_selector"
                                title="Create Selector"
                            >
                                <NewSelectorForm closeModal={closeModal} />
                            </ModalManager.Modal>

                            <ModalManager.Modal
                                id="new_field"
                                title="Add Dataset Field"
                            >
                                <NewFieldForm closeModal={closeModal} />
                            </ModalManager.Modal>
                        </ModalManager>

                        {children}
                    </div>
                </QuantaIndicatorManager>
            </QuantaContextData.Provider>
        </>
    )
}

export { QuantaContextData }
export default QuantaContext