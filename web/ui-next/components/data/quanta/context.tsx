import { createContext, useContext, useEffect, useState } from "react"
import { IQuantaSchema } from "../../quanta/schema-editor/types"
import ModalManager from "../../ui/modal-manager"
import { IQuantaState } from "./types"
import { IQuantaEditorProject, IQuantaProjectData, ProjectSchemas } from "./types/project"
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
    SaveQuantaProject
} from "./functions"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore, IQuantaTypeRef } from "../../quanta/quanta-editor/types/types"
import NewFieldForm from "./forms/new_field"
import { GetProject } from "./quanta-api"
import { UserContextData } from "../user/context"
import { IUserContext } from "../user/types"

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

    //store elements
    const [editorProjects, setEditorProjects] = useState<IQuantaEditorProject[]>([])

    const { authData } = useContext(UserContextData) as IUserContext

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId, organizationId])

    useEffect(() => {
        //update the editor
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return

        SaveQuantaProject(token, organizationId, quantaId, projectData, editorProjects)
    }, [editorProjects])

    let value: IQuantaState = {} as IQuantaState
    value.project_data = { ...projectData }
    if(value.project_data !== undefined)
        value.project_data.dataset_schema = schemas
    if(value.project_data.store === undefined)
        value.project_data.store = { selectors: [] }
    value.project_data.store.editorProjects = editorProjects

    value.updateEditorSchema = updateEditorSchema
    value.updateSchema = updateSchema
    value.tabId = activeTab
    value.tabs = tabs
    value.activeSelectorId = activeSelector

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

    value.setEditorProject = (fileId: string, nodes: IQuantaRFNode[], edges: IQuantaRFEdge[], quantaStore: IQuantaStore) =>
        SetEditorProjectData(fileId, nodes, edges, quantaStore, editorProjects, setEditorProjects)

    //function that loads the quanta data
    function loadQuanta() {
        if(quantaId === null) {
            let defaultProject = DefaultQuantaProject()
            setProjectData({ ...defaultProject })
            return
        }

        //otherwise load the project from the server
        async function main() {
            let token = authData?.token
            if(organizationId === null || token === undefined)
                return

            let project = await GetProject(token, organizationId, quantaId!)
            if(project === undefined)
                return

            let projectFiles = project.files
            if(projectFiles === undefined)
                return

            let projectFile = projectFiles[0]
            let _editorProjects = project.store?.editorProjects

            setProjectData({ ...project })
            value.focusTab(projectFile.id!, projectFile.type!)
            if(_editorProjects !== undefined)
                setEditorProjects([ ..._editorProjects ])
        }

        main()
    }

    return (
        <>
            <QuantaContextData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    <ModalManager
                        modalState={modalState}
                        close={closeModal}
                    >
                        <ModalManager.Modal
                            id="new_selector"
                            title="Create Selector"
                        >

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
            </QuantaContextData.Provider>
        </>
    )
}

export { QuantaContextData }
export default QuantaContext