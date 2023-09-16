import { Dispatch, SetStateAction, createContext, useCallback, useMemo, useState } from "react"
import { ILunarUIState } from "./state"
import { IPortalButton } from "../types"
import { ISigmyzeFilesystem } from "../../ui/file-management/types"
import ModalManager from "../../ui/modal-manager"
import NewFolderModal from "./forms/new-folder"
import { createFile, createFolder, setFolderOpenState } from "../data-manager/functions"
import NewNoteForm from "./forms/new-note"
import { ISynchroMessage } from "./types"
import { v4 } from "uuid"
import NewChartForm from "./forms/new-chart"

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

    //this is the raw synchro message list
    const [synchroMessages, setSynchroMessages] = useState<ISynchroMessage[]>([])
    //this is how many synchro messages are left to be processed
    const messagesLeft = useMemo(() => synchroMessages.length, [synchroMessages])

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

        let newSynchroMessages = [ ...synchroMessages, newMessage ]
        setSynchroMessages([ ...newSynchroMessages ])
    }, [synchroMessages])

    /**
     * NOTE: This method is shared out through the context.
     * This method pops a synchro message from the synchroMessages list, returns the message and removes the item from the list.
     */
    const consumeSynchroMessage = useCallback(() => {
        let newSynchroMessages = synchroMessages
        let consumedMessage = newSynchroMessages.shift()

        setSynchroMessages([ ...newSynchroMessages ])
        return consumedMessage
    }, [synchroMessages])

    /**
     * NOTE: This method is to only be used within a form component.
     * This is the callback for the method that creates a folder in the current activeFolderId directory.
     */
    const createFolderCallback = useCallback((folderName: string) => {
        let newFilesystem = createFolder(activeFolderId, folderName, loadedFilesystem)
        if(newFilesystem === undefined)
            return

        setLoadedFilesystem({ ...newFilesystem })
    }, [loadedFilesystem, activeFolderId])

    /**
     * NOTE: This method is to only be used within the form components.
     * This is the callback for the method that creates a file in the activeFolderID's directory
     */
    const createFileCallback = useCallback((fileName: string, fileType: string) => {
        let newFilesystem = createFile(loadedFilesystem, activeFolderId, fileName, fileType, addCreateSynchroMessage)
        if(newFilesystem === undefined)
            return

        setLoadedFilesystem({ ...newFilesystem })
    }, [addCreateSynchroMessage, loadedFilesystem, activeFolderId])

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
        messagesLeft,
        setItemActive,
        resetActive,
        setLoadedFilesystem,
        consumeSynchroMessage,
        setFolderOpenState: setFolderOpenStateCallback
    }), [
        portalButtons,
        activeItemId,
        loadedFilesystem,
        debugMode,
        messagesLeft,
        setItemActive,
        resetActive,
        consumeSynchroMessage,
        setFolderOpenStateCallback
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
                    </ModalManager>

                    {children}
                </div>
            </LunarUIContextData.Provider>
        </>
    )
}

export { LunarUIContextData }
export default LunarUIContext