import { useCallback, useEffect, useState } from "react"
import { IPortalButton } from "../types"
import { PORTAL_BUTTONS_CHART, PORTAL_BUTTONS_FOLDER, PORTAL_BUTTONS_INDICATOR, PORTAL_BUTTONS_NOTE } from "./portal-buttons"
import { ISigmyzeFilesystem } from "../../ui/file-management/types"
import LunarRefreshView from "./view"
import LunarUIContext from "../ui-context"
import { hydratePortalButtons } from "../data-manager/functions"
import ApplicationLayout from "../../nav-elements/application-layout"
import AddIndicatorFlow from "../ui-context/forms/add-indicator-flow"
import QuantaDatasetManager from "../../ui/quanta-dataset-manager"
import { useLunarToggles } from "./hooks"

/**
 * Theese are the props required so the LunarRefresh page can successfully mount
 */
interface ILunarRefreshProps {
    /**
     * NOTE: This field is for testing purposes only.
     * This can ovveride the testing portal, and calls the assignPortalButton's function where the portalId = the value of this field.
     */
    testingPortal?: string,

    /**
     * NOTE: This field is for testing purposes only.
     * This can override and load this fileSystem into the loadedFilesystem.
     */
    mockFilesystem?: ISigmyzeFilesystem,

    /**
     * NOTE: This is not meant to be used in a production context. For testing purposes only.
     * This is to indicate to components that the page is in debug mode.
     */
    defaultDebugMode?: boolean
}

//TODO: Convert loaded filesystem to string so react can detect the changes

const LunarRefresh: React.FC<ILunarRefreshProps> = ({ testingPortal, mockFilesystem, defaultDebugMode }) => {
    //this is the title for the page TODO: implement dynamic title
    const [title, setTitle] = useState<string>("Sigmyze::Lunar")
    //theese are the portal buttons that are rendered in the side navbar
    const [portalButtons, setPortalButtons] = useState<IPortalButton[]>([])
    //this is the filesystem for the loaded lunar project
    const [loadedFilesystem, setLoadedFilesystem] = useState<string | undefined>(undefined)
    //this is the current active folderId within the file explorer
    const [activeFolderId, setActiveFolderId] = useState<string | undefined>(undefined)
    //this is the current active itemId (both folder and file id's) within the file explorer
    const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined)
    //whether or not the component is in debug mode
    const [debugMode, setDebugMode] = useState<boolean>(false)
    //theese are the portal buttons after hydration
    const [hydratedPortalButtons, setHydratedPortalButtons] = useState<IPortalButton[]>([])
    //this is the state of the modal controller within the UI context
    const [modalState, setModalState] = useState<string | null>(null)
    //whether or not the editor is in debugMode
    const [editorDebugMode, setEditorDebugMode] = useState<boolean>(false)

    const {
        addIndicatorFlowToggle,
        settingsFlowToggle,
        deleteIndicatorFlowToggle,
        openAddIndicatorFlow,
        openSettingsFlow,
        openDeleteIndicatorFlow
    } = useLunarToggles()

    /**
     * NOTE: This is an internal function, and should not be used outside of this component.
     * This function sets the list of rendered buttons by matching the portalId with preset buttons created in portal-buttons.tsx.
     */
    const assignPortalButtons = useCallback((portalId: string, itemId: string) => {
        switch(portalId) {
            case "folder":
                let folderPortalButtons = PORTAL_BUTTONS_FOLDER
                if(itemId === "project-root")
                    folderPortalButtons[1].disabled = true
                else
                    folderPortalButtons[1].disabled = false

                setPortalButtons([ ...folderPortalButtons ])
                break
            case "chart":
                setPortalButtons([ ...PORTAL_BUTTONS_CHART ])
                break
            case "note":
                setPortalButtons([ ...PORTAL_BUTTONS_NOTE ])
                break
            case "indicator":
                setPortalButtons([ ...PORTAL_BUTTONS_INDICATOR ])
                break
            default:
                return
        }
    }, [])

    /**
     * This is the callback for the setItemActive function.
     * As well has handling the setting of the activeItemId field, it also sets the appropriate portal buttons based on the type,
     * and the activeFolderId based on if the item is a folder or not.
     */
    const setItemActive = useCallback((itemId: string, itemType: string) => {
        if(itemType === "folder")
            setActiveFolderId(itemId)

        assignPortalButtons(itemType, itemId)
        setActiveItemId(itemId)
    }, [])

    /**
     * This is the callback for the resetActive function.
     * It resets the active item within the filesystem to the root folder.
     */
    const resetActive = useCallback(() => {
        if(loadedFilesystem === undefined)
            return

        setItemActive('project-root', 'folder')
    }, [loadedFilesystem])

    /**
     * utility method to open the modal to a specific modalId
     */
    const openModal = useCallback((modalId: string) => {
        setModalState(modalId)
    }, [])

    /**
     * utility method that closes the modal
     */
    const closeModal = useCallback(() => {
        setModalState(null)
    }, [])

    /**
     * This is the effect that handles the setting of the testing portal
     */
    useEffect(() => {
        if(testingPortal === undefined)
            return

        assignPortalButtons(testingPortal, "")
        setActiveItemId('testing')
        setDebugMode(true)
    }, [testingPortal])

    /**
     * This is the effect that handles the setting of the editor debug mode based on the defaultDebugMode prop
     */
    useEffect(() => {
        if(defaultDebugMode === undefined)
            return

        setEditorDebugMode(defaultDebugMode)
    }, [defaultDebugMode])

    /**
     * this is the effect that handles the setting of the mockFilesystem
     */
    useEffect(() => {
        if(mockFilesystem === undefined) {
            setDebugMode(false)
            return
        }

        setLoadedFilesystem(JSON.stringify(mockFilesystem))
        setDebugMode(true)
    }, [mockFilesystem])

    /**
     * this is the effect responsible for hydrating the portal button's with their correct onClick function.
     */
    useEffect(() => {
        let newHydratedPortalButtons = hydratePortalButtons(portalButtons, { 
            "new-folder": () => openModal('new-folder-modal'),
            "new-note": () => openModal('new-note-modal'),
            "new-chart": () => openModal('new-chart-modal'),
            "folder-delete": () => openModal('delete-folder-modal'),
            "chart-add": () => openAddIndicatorFlow(),
            "chart-settings": () => openSettingsFlow(),
            "indicator-remove": () => openDeleteIndicatorFlow()
        })

        setHydratedPortalButtons([...newHydratedPortalButtons])
    }, [portalButtons, openAddIndicatorFlow])

    return (
        <ApplicationLayout
            title={title}
            description=""
            location="/lunar"
            protectedView={true}
            portalButtons={hydratedPortalButtons}
        >
            <QuantaDatasetManager>
                <LunarUIContext
                    portalButtons={hydratedPortalButtons}
                    activeItemId={activeItemId}
                    activeFolderId={activeFolderId}
                    loadedFilesystem={loadedFilesystem}
                    debugMode={debugMode}
                    editorDebugMode={editorDebugMode}
                    modalState={modalState}
                    closeModal={closeModal}
                    setItemActive={setItemActive}
                    resetActive={resetActive}
                    setLoadedFilesystem={setLoadedFilesystem}
                >
                    <>
                        <AddIndicatorFlow activateFlow={addIndicatorFlowToggle} />

                        <LunarRefreshView
                            fileSystem={loadedFilesystem ? JSON.parse(loadedFilesystem) : undefined}
                            activeItemId={activeItemId}
                            settingsFlowToggle={settingsFlowToggle}
                            setItemActive={setItemActive}
                            resetActive={resetActive}
                            assignPortalButtons={assignPortalButtons}
                            deleteIndicatorFlowToggle={deleteIndicatorFlowToggle}
                        />
                    </>
                </LunarUIContext>
            </QuantaDatasetManager>
        </ApplicationLayout>
    )
}

export default LunarRefresh