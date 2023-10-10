import { Dispatch, SetStateAction, createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ILunarUIState } from "./state"
import { IPortalButton } from "../types"
import { ISigmyzeFilesystem } from "../../ui/file-management/types"
import ModalManager from "../../ui/modal-manager"
import NewFolderModal from "./forms/new-folder"
import { createFile, createFolder, deleteFolder, setFolderOpenState } from "../data-manager/functions"
import NewNoteForm from "./forms/new-note"
import { ISynchroMessage } from "./types"
import { v4 } from "uuid"
import NewChartForm from "./forms/new-chart"
import { ILunarTab } from "../page/viewport/types"
import { closeTab, closeTabFileId, openTab } from "./functions"
import DeleteFolderForm from "./forms/delete-folder"

const LunarUIContextData = createContext<ILunarUIState | null>(null)

interface ILunarUIContextProps {
    portalButtons: IPortalButton[],
    activeItemId: string | undefined,
    activeFolderId: string | undefined,
    loadedFilesystem: ISigmyzeFilesystem | undefined,
    debugMode: boolean,
    modalState: string | null,
    closeModal: () => void,
    setItemActive: (itemId: string, itemType: string) => void,
    resetActive: () => void,
    setLoadedFilesystem: Dispatch<SetStateAction<ISigmyzeFilesystem | undefined>>,
    children: React.ReactNode
}

const LunarUIContext: React.FC<ILunarUIContextProps> = ({
    portalButtons,
    activeItemId,
    activeFolderId,
    loadedFilesystem,
    debugMode,
    modalState,
    closeModal,
    setItemActive,
    resetActive,
    setLoadedFilesystem,
    children
}) => {
    /**
     * in order for the data and ui to link, we will use a message system in order to synchronize big events such as file create
     * and delete, as those require actions within the data end as well in order to make sure the right components are initiated and removed.
     */

    //this is the list of all the active tabs within the viewport
    const [tabs, setTabs] = useState<ILunarTab[]>([])
    //this is the state which will determine which tab in the potential tablist will be active
    const [activeTab, setActiveTab] = useState<string | null>(null)

    //TODO: convert synchro messages into a ref based queue
    const synchroMessageQueue = useRef<ISynchroMessage[]>([])
    //the amount of syncrho messages left to consume
    const [synchroQueueLength, setSynchroQueueLength] = useState<number>(0)

    //this is the ref that is the queue for closing tabs
    const closeTabQueue = useRef<string[]>([])
    //this is the length of the closeTabQueue, used to handle the consumption of the queue
    const [closeTabLength, setCloseTabLength] = useState<number>(0)

    //internal methods

    /**
     * NOTE: This method is to be used only internally within the UI context.
     * This is a helper method that adds a synchro message to the list of synchro messages in order for the Data context to sync with the UI context.
     */
    const addCreateSynchroMessage = useCallback((fileName: string, fileType: string, fileId: string) => {
        let fileData = `${fileType}::${fileName}::${fileId}`
        const newMessage: ISynchroMessage = {
            messageId: v4(),
            messageType: "CREATE",
            messageData: fileData
        }

        //construct using new queue model
        let oldSyncrhoMessages = synchroMessageQueue.current
        let newSynchroMessages = [ ...oldSyncrhoMessages, newMessage ]
        //set ref and update length
        synchroMessageQueue.current = newSynchroMessages
        setSynchroQueueLength(newSynchroMessages.length)
    }, [])

    /**
     * NOTE: This method is to be used only internally within the UI context.
     * This is a helper method that adds a synchro message to delete a file
     */
    const addDeleteSynchroMessage = useCallback((fileType: string, fileId: string) => {
        let fileData = `${fileType}::${fileId}`
        const newMessage: ISynchroMessage = {
            messageId: v4(),
            messageType: "DELETE",
            messageData: fileData
        }

        //construct using new queue model
        let oldSyncrhoMessages = synchroMessageQueue.current
        let newSynchroMessages = [ ...oldSyncrhoMessages, newMessage ]
        //set ref and update length
        synchroMessageQueue.current = newSynchroMessages
        setSynchroQueueLength(newSynchroMessages.length)
    }, [])

    /**
     * NOTE: This method is shared out through the context.
     * This method pops a synchro message from the synchroMessages list, returns the message and removes the item from the list.
     */
    const consumeSynchroMessage = useCallback(() => {
        let newSynchroMessages = synchroMessageQueue.current
        let consumedMessage = newSynchroMessages.shift()

        synchroMessageQueue.current = newSynchroMessages
        setSynchroQueueLength(newSynchroMessages.length)
        return consumedMessage
    }, [])

    /**
     * NOTE: This method is shared out through the context.
     * This is the callback for the function that opens a tab
     */
    const openTabCallback = useCallback((fileId: string) => {
        if(loadedFilesystem === undefined)
            return
        
        openTab(loadedFilesystem, fileId, tabs, setTabs, setActiveTab, setItemActive)
    }, [loadedFilesystem, tabs])

    /**
     * NOTE: This method is shared throghout the context.
     * This is the callback for the function that closes a tab
     */
    const closeTabCallback = useCallback((tabId: string) => {
        let newTab = closeTab(tabId, tabs, activeTab, setTabs, resetActive)
        if(newTab === undefined)
            return

        openTabCallback(newTab.fileId)
    }, [tabs, activeTab, openTabCallback, resetActive])

    /**
     * NOTE: This method is to only be used within this file.
     * This is the callback for the function that closes a tab based on its associated fileId.
     */
    const closeTabFileIdCallback = useCallback((fileId: string) => {
        let newTab = closeTabFileId(fileId, tabs, activeTab, setTabs, resetActive)
        if(newTab === undefined)
            return

        openTabCallback(newTab.fileId)
    }, [tabs, activeTab, openTabCallback, resetActive])

    /**
     * NOTE: Meant to only be used within the context.
     * @description
     *  - this is the function that adds a bulk amount of fileId's to the close tab queue
     */
    const addCloseFileIdTabBulk = useCallback((fileIds: string[]) => {
        let newCloseTabQueue = closeTabQueue.current
        for(let i = 0; i < fileIds.length; i++) {
            let fileId = fileIds[i]
            newCloseTabQueue.push(fileId)
        }

        closeTabQueue.current = newCloseTabQueue
        setCloseTabLength(newCloseTabQueue.length)
    }, [])

    /**
     * NOTE: Meant to only be used within the context.
     * @description
     *  - this is the function that consumes a fileId in the closeFileIdTabQueue
     */
    const consumeFileIdCloseQueue = useCallback(() => {
        let queueValue = closeTabQueue.current
        let consumedValue = queueValue.shift()
        closeTabQueue.current = queueValue

        setCloseTabLength(queueValue.length)
        return consumedValue
    }, [])

    //effect that consumes a close tab queue (fileId)
    useEffect(() => {
        if(closeTabLength === 0)
            return

        let consumedValue = consumeFileIdCloseQueue()
        if(consumedValue === undefined)
            return

        closeTabFileIdCallback(consumedValue)
    }, [closeTabLength])

    /**
     * NOTE: This method is to only be used within a form component.
     * This is the callback for the method that creates a folder in the current activeFolderId directory.
     */
    const createFolderCallback = useCallback((folderName: string) => {
        let newFilesystemOutput = createFolder(activeFolderId, folderName, loadedFilesystem)
        if(newFilesystemOutput === undefined)
            return

        let newFilesystem = newFilesystemOutput.filesystem
        setLoadedFilesystem({ ...newFilesystem })
        if(newFilesystemOutput.folderId !== undefined)
            setItemActive(newFilesystemOutput.folderId, "folder")
    }, [loadedFilesystem, activeFolderId, setItemActive])

    /**
     * NOTE: This method is to only be used within a form component.
     * This is the callback for the method that deletes a folder in the filesystem.
     */
    const deleteFolderCallback = useCallback((folderId: string) => {
        if(loadedFilesystem === undefined)
            return
        
        //TODO: Implement a feature to set the active item to the parent in the sidebar
        let newFilesystem = deleteFolder(
            folderId, 
            loadedFilesystem, 
            addDeleteSynchroMessage,
            setItemActive,
            addCloseFileIdTabBulk
        )

        setLoadedFilesystem({ ...newFilesystem })
    }, [loadedFilesystem, addDeleteSynchroMessage, setItemActive])

    /**
     * NOTE: This method is to only be used within the form components.
     * This is the callback for the method that creates a file in the activeFolderID's directory
     */
    const createFileCallback = useCallback((fileName: string, fileType: string) => {
        let newFilesystem = createFile(
            loadedFilesystem, 
            activeFolderId, 
            fileName, 
            fileType, 
            addCreateSynchroMessage,
        )

        let sigmyzeFilesystem = newFilesystem.filesystem
        if(sigmyzeFilesystem === undefined || newFilesystem.fileId === "null")
            return
        
        setLoadedFilesystem({ ...sigmyzeFilesystem })
        openTabCallback(newFilesystem.fileId)
    }, [addCreateSynchroMessage, openTabCallback, loadedFilesystem, activeFolderId])

    /**
     * NOTE: This method is shared out through the context.
     * This is the callback for the function that sets the requested folder's openState
     */
    const setFolderOpenStateCallback = useCallback((folderId: string, openState: boolean) => {
        let newFilesystem = setFolderOpenState(loadedFilesystem, folderId, openState)
        if(newFilesystem === undefined)
            return

        setLoadedFilesystem({ ...newFilesystem })
    }, [loadedFilesystem])

    const value: ILunarUIState = useMemo(() => ({
        portalButtons,
        activeItemId,
        loadedFilesystem,
        debugMode,
        messagesLeft: synchroQueueLength,
        tabs,
        activeTab,
        setActiveTab,
        setItemActive,
        resetActive,
        setLoadedFilesystem,
        consumeSynchroMessage,
        setFolderOpenState: setFolderOpenStateCallback,
        openTab: openTabCallback,
        closeTab: closeTabCallback
    }), [
        portalButtons,
        activeItemId,
        loadedFilesystem,
        debugMode,
        synchroQueueLength,
        tabs,
        activeTab,
        setItemActive,
        resetActive,
        consumeSynchroMessage,
        setFolderOpenStateCallback,
        openTabCallback,
        closeTabCallback
    ])

    return (
        <>
            <LunarUIContextData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    <ModalManager
                        modalState={modalState}
                        close={closeModal}
                    >
                        <ModalManager.Modal 
                            id="new-folder-modal"
                            title="New Folder"
                        >
                            <NewFolderModal 
                                close={closeModal} 
                                createFolder={createFolderCallback}
                            />
                        </ModalManager.Modal>

                        <ModalManager.Modal
                            id="new-note-modal"
                            title="New Note"
                        >
                            <NewNoteForm 
                                close={closeModal}
                                createFile={createFileCallback}
                            />
                        </ModalManager.Modal>

                        <ModalManager.Modal
                            id="new-chart-modal"
                            title="New Chart"
                        >
                            <NewChartForm
                                close={closeModal}
                                createFile={createFileCallback}
                            />
                        </ModalManager.Modal>

                        <ModalManager.Modal
                            id="delete-folder-modal"
                            title="Delete Folder"
                        >
                            <DeleteFolderForm 
                                close={closeModal}
                                deleteFolder={deleteFolderCallback}
                            />
                        </ModalManager.Modal>
                    </ModalManager>

                    {children}
                </div>
            </LunarUIContextData.Provider>
        </>
    )
}

export { LunarUIContextData }
export default LunarUIContext