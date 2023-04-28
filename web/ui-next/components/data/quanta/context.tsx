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
    addSelectorSource,
    editSelectorAnalysis,
    editPipelineObjects,
    eraseSchema,
    deleteSelector
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
import { IPipelineAnalysis, IPipelinedData } from "../../quanta/selector-pane/context/types"
import { useEffectDebugger, usePrevious } from "../../ui/debug"

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
    const prevSchemas = usePrevious(schemas, [])
    const [schemaLoad, setSchemaLoad] = useState(false)

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
    const [selectorLoad, setSelectorLoad] = useState(false)

    const [dataLoaded, setDataLoaded] = useState(false)
    const [selectorUpdated, setSelectorUpdated] = useState(false)
    const toggleSelectorUpdate = () => setSelectorUpdated(!selectorUpdated)

    const { authData } = useContext(UserContextData) as IUserContext

    function saveFunc(caller?: string) {
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return
        if(dataLoaded === false)
            return

        SaveQuantaProject(token, organizationId, quantaId, projectData, editorProjects, schemas, selectors)
        setSaveCounter(0)
    }

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId, organizationId])

    useEffect(() => {
        if(dataLoaded === false)
            return
        if(selectorLoad === true) {
            setSelectorLoad(false)
            return
        }

        toggleSelectorUpdate()
        setSaveCounter(saveCounter + 1)
    }, [selectors])

    useEffect(() => {
        //update the editor
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return

        setSaveCounter(saveCounter + 1)
    }, [editorProjects])

    useEffect(() => {
        if(dataLoaded === false)
            return
        if(schemaLoad === true) {
            setSchemaLoad(false)
            return
        }

        let oldJson = JSON.stringify(prevSchemas)
        let newJson = JSON.stringify(schemas)
        if(oldJson === newJson)
            return

        saveFunc("caller_schema")
    }, [schemas])

    useEffect(() => {    
        if(dataLoaded === false)
            return
        
        let interval: NodeJS.Timer | undefined = undefined
        if(saveCounter !== 50 && saveCounter > 0)
            interval = setInterval(() => {
                saveFunc("caller_save_1")
            }, 1000 * 15)
        else if (saveCounter === 50)
            saveFunc("caller_save_2")

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
    value.selectors = selectors

    value.updateEditorIndicators = updateEditorIndicators
    value.toggleUpdateEditorIndicators = toggleUpdateEditorIndicators

    value.updateEditorSchema = updateEditorSchema
    value.updateSchema = updateSchema
    value.tabId = activeTab
    value.tabs = tabs
    value.activeSelectorId = activeSelector
    value.dataLoaded = dataLoaded

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

    value.eraseSchema = (parentId: string) =>
        eraseSchema(parentId, schemas, setSchemas)

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

    value.editSelectorAnalysis = (selectorId: string, analysis: IPipelineAnalysis[]) =>
        editSelectorAnalysis(selectorId, analysis, selectors, setSelectors)
    
    value.editPipelineObjects = (selectorId: string, data: IPipelinedData[]) =>
        editPipelineObjects(selectorId, data, selectors, setSelectors)

    value.deleteSelector = (selectorId: string) =>
        deleteSelector(selectorId, selectors, value.eraseSchema, setSelectors, setActiveSelector)
    
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
            if(schema !== undefined) {
                setSchemas([ ...schema ])
                setSchemaLoad(true)
            }

            let editorProjects = projectData.store?.editorProjects
            if(editorProjects !== undefined)
                setEditorProjects([ ...editorProjects ])

            let loadedSelectors = projectData.store?.selectors
            if(loadedSelectors !== undefined) {
                setSelectors([ ...loadedSelectors ])
                setSelectorLoad(true)
            }

            toggleUpdateSchema()
            toggleUpdateEditorSchema()
            toggleSelectorUpdate()

            setDataLoaded(true)
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