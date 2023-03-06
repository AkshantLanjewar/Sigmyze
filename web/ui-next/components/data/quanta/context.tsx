import { createContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { IQuantaSchema } from "../../quanta/schema-editor/types"
import ModalManager from "../../ui/modal-manager"
import { activateSelector, changeTab, changeText, closeTab, focusTab, openModal, openSelector } from "./functions"
import { IQuantaState } from "./types"
import { IQuantaProjectData } from "./types/project"
import { IQuantaTab } from "./types/ui"
import { DefaultQuantaProject } from "./utils"

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
    const [datasetSchema, setDatasetSchema] = useState<IQuantaSchema | undefined>(undefined)

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
        value.project_data.dataset_schema = datasetSchema

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