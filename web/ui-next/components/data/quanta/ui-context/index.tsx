import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { IQuantaTab } from "../types/ui"
import { IQuantaUIState } from "./state"
import { changeTab, closeTab, focusTab } from "./functions"
import { IQuantaProjectData } from "../types/project"
import ModalManager from "../../../ui/modal-manager"
import NewSelectorForm from "../forms/new_selector"
import NewFieldForm from "../forms/new_field"
import NewCodeSelector from "../forms/new_code_selector"
import { QuantaCodeContextData } from "../quanta-code-context"
import { IQuantaCodeContext } from "../quanta-code-context/state"
import { WebContainer } from "@webcontainer/api"

interface IQuantaUIContextProps {
    projectData: IQuantaProjectData | undefined,
    children?: JSX.Element | never[]
}

const QuantaUIContextData = createContext<IQuantaUIState | null>(null)

const QuantaUIContext: React.FC<IQuantaUIContextProps> = ({ children, projectData }) => {
    //state relating to the tabs
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
    const [tabs, setTabs] = useState<IQuantaTab[]>([] as IQuantaTab[])
    //this is the ref that will store the webcontainer
    const [containerCreated, setContainerCreated] = useState(false)
    const containerRef = useRef<WebContainer | null>(null)

    //state for the modal managaer
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const { codeItems } = useContext(QuantaCodeContextData) as IQuantaCodeContext

    const changeTabCallback = useCallback((tabId: string) => {
        changeTab(tabId, activeTab, setActiveTab)
    }, [activeTab])

    const focusTabCallback = useCallback((fileId: string, fileType: string) => {
        focusTab(fileId, fileType, tabs, projectData, codeItems, setTabs, setActiveTab)
    }, [tabs, projectData, codeItems])

    const closeTabCallback = useCallback((tabId: string) => {
        closeTab(tabId, tabs, activeTab, setTabs, setActiveTab)
    }, [tabs, activeTab])

    const openModalCallback = useCallback((modalId: string) => {
        setModalState(modalId)
    }, [])

    //method that will return the value of the container ref
    const getContainer = useCallback(() => {
        return containerRef.current
    }, [])

    //here we will move the webcontainer booting process since we dont need to persist this to the server
    useEffect(() => {
        async function main() {
            try {
                const container = await WebContainer.boot()
                containerRef.current = container
                setContainerCreated(true)
            } catch {}
        }

        main()

        return () => containerRef.current?.teardown()
    }, [])

    let value: IQuantaUIState = useMemo(() => ({
        tabId: activeTab,
        tabs: tabs,
        webcontainerCreated: containerCreated,

        changeTab: changeTabCallback,
        focusTab: focusTabCallback,
        closeTab: closeTabCallback,
        openModal: openModalCallback,
        getContainer: getContainer
    }), [
        activeTab,
        tabs,
        containerCreated,
        changeTabCallback,
        focusTabCallback,
        closeTabCallback,
        openModalCallback,
        getContainer
    ])

    return (
        <>
            <QuantaUIContextData.Provider value={value}>
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

                        <ModalManager.Modal
                            id="new_code_selector"
                            title="Create Selector"
                        >
                            <NewCodeSelector closeModal={closeModal} />
                        </ModalManager.Modal>
                    </ModalManager>

                    {children}
                </div>
            </QuantaUIContextData.Provider>
        </>
    )
}

export { QuantaUIContextData }
export default QuantaUIContext