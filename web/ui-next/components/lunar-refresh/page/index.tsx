import { useCallback, useEffect, useState } from "react"
import { IPortalButton } from "../types"
import { PORTAL_BUTTONS_CHART, PORTAL_BUTTONS_FOLDER, PORTAL_BUTTONS_NOTE } from "./portal-buttons"
import { ISigmyzeFilesystem } from "../../ui/file-management/types"
import LunarRefreshView from "./view"
import LunarUIContext from "../ui-context"
import { hydratePortalButtons } from "../data-manager/functions"
import ApplicationLayout from "../../nav-elements/application-layout"

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
    mockFilesystem?: ISigmyzeFilesystem
}

const LunarRefresh: React.FC<ILunarRefreshProps> = ({ testingPortal, mockFilesystem }) => {
    //this is the title for the page TODO: implement dynamic title
    const [title, setTitle] = useState<string>("Sigmyze::Lunar")
    //theese are the portal buttons that are rendered in the side navbar
    const [portalButtons, setPortalButtons] = useState<IPortalButton[]>([])
    //this is the filesystem for the loaded lunar project
    const [loadedFilesystem, setLoadedFilesystem] = useState<ISigmyzeFilesystem | undefined>(undefined)
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

    /**
     * NOTE: This is an internal function, and should not be used outside of this component.
     * This function sets the list of rendered buttons by matching the portalId with preset buttons created in portal-buttons.tsx.
     */
    const assignPortalButtons = useCallback((portalId: string) => {
        switch(portalId) {
            case "folder":
                setPortalButtons([ ...PORTAL_BUTTONS_FOLDER ])
                break
            case "chart":
                setPortalButtons([ ...PORTAL_BUTTONS_CHART ])
                break
            case "note":
                setPortalButtons([ ...PORTAL_BUTTONS_NOTE ])
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

        assignPortalButtons(itemType)
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

        assignPortalButtons(testingPortal)
        setActiveItemId('testing')
        setDebugMode(true)
    }, [testingPortal])

    /**
     * this is the effect that handles the setting of the mockFilesystem
     */
    useEffect(() => {
        if(mockFilesystem === undefined) {
            setDebugMode(false)
            return
        }

        setLoadedFilesystem({ ...mockFilesystem })
        setDebugMode(true)
    }, [mockFilesystem])

    /**
     * this is the effect responsible for hydrating the portal button's with their correct onClick function.
     */
    useEffect(() => {
        let newHydratedPortalButtons = hydratePortalButtons(portalButtons, { 
            "new-folder": () => openModal('new-folder-modal'),
            "new-note": () => openModal('new-note-modal'),
            "new-chart": () => openModal('new-chart-modal')
        })

        setHydratedPortalButtons([...newHydratedPortalButtons])
    }, [portalButtons])

    return (
        <ApplicationLayout
            title={title}
            description=""
            location="/lunar"
            protectedView={true}
            portalButtons={portalButtons}
        >
            <LunarUIContext
                portalButtons={hydratedPortalButtons}
                activeItemId={activeItemId}
                activeFolderId={activeFolderId}
                loadedFilesystem={loadedFilesystem}
                debugMode={debugMode}
                modalState={modalState}
                closeModal={closeModal}
                setItemActive={setItemActive}
                resetActive={resetActive}
                setLoadedFilesystem={setLoadedFilesystem}
            >
                <LunarRefreshView
                    fileSystem={loadedFilesystem}
                    activeItemId={activeItemId}
                    setItemActive={setItemActive}
                    resetActive={resetActive}
                />
            </LunarUIContext>
        </ApplicationLayout>
    )
}

export default LunarRefresh