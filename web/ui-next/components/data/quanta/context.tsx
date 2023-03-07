import { createContext, useEffect, useState } from "react"
import { IQuantaSchema } from "../../quanta/schema-editor/types"
import ModalManager from "../../ui/modal-manager"
import { IQuantaState } from "./types"
import { IQuantaProjectData, ProjectSchemas } from "./types/project"
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
    unfocusAllSchema
} from "./functions"
import { IQuantaTypeRef } from "../../quanta/quanta-editor/types/types"

interface IQuantaContextProps {
    quantaId?: string,
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ quantaId, children }) => {
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

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId])

    //function that loads the quanta data
    function loadQuanta() {
        if(quantaId === undefined) {
            let defaultProject = DefaultQuantaProject()
            setProjectData({ ...defaultProject })
        }
    }

    let value: IQuantaState = {} as IQuantaState
    value.project_data = { ...projectData }
    if(value.project_data !== undefined)
        value.project_data.dataset_schema = schemas

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

    value.createElement = (parentId: string, nodeId: string) =>
        createElement(parentId, nodeId, value.getSchema(parentId), value.changeSchema, toggleUpdateEditorSchema)

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
                    </ModalManager>

                    {children}
                </div>
            </QuantaContextData.Provider>
        </>
    )
}

export { QuantaContextData }
export default QuantaContext