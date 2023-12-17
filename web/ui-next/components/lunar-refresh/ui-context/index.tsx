import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
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
import DeleteFolderForm from "./forms/delete-folder"
import useUITabs from "./hooks/ui-tabs-data"
import useSynchroMessage from "./hooks/ui-synchro-data"
import useSigmyzeFilesystemUtil from "./hooks/ui-filesystem-data"
import { useAddQueue } from "./hooks/ui-add-indicator"

const LunarUIContextData = createContext<ILunarUIState | null>(null)

interface ILunarUIContextProps {
    portalButtons: IPortalButton[],
    activeItemId: string | undefined,
    activeFolderId: string | undefined,
    loadedFilesystem: string | undefined,
    debugMode: boolean,
    editorDebugMode: boolean,
    modalState: string | null,
    closeModal: () => void,
    setItemActive: (itemId: string, itemType: string) => void,
    resetActive: () => void,
    setLoadedFilesystem: Dispatch<SetStateAction<string | undefined>>,

    /**
     * This is the function that opens the delete indicator flow
     */
    openDeleteIndicatorFlow: () => void

    children: React.ReactNode
}

const LunarUIContext: React.FC<ILunarUIContextProps> = ({
    portalButtons,
    activeItemId,
    activeFolderId,
    loadedFilesystem,
    debugMode,
    editorDebugMode,
    modalState,
    closeModal,
    setItemActive,
    resetActive,
    setLoadedFilesystem,
    openDeleteIndicatorFlow,
    children
}) => {
    //state hooks
    const { 
        synchroQueueLength, 
        addCreateSynchroMessage, 
        addDeleteSynchroMessage, 
        consumeSynchroMessage,
        addEditTitleSynchroMessage 
    } = useSynchroMessage()

    const { getFileById, editFileTitle } = useSigmyzeFilesystemUtil(loadedFilesystem, setLoadedFilesystem, addEditTitleSynchroMessage)

    const { 
        tabs, 
        activeTab, 
        activeFile,
        setActiveTab, 
        closeTabCallback ,
        openTabCallback,
        addCloseFileIdTabBulk,
    } = useUITabs(loadedFilesystem, setItemActive, resetActive)

    const { 
        messages, 
        addIndicator, 
        consumeIndicator,
        delMessages,
        deleteIndicator,
        consumeDELIndicator 
    } = useAddQueue()

    //internal methods
    /**
     * NOTE: This method is to only be used within a form component.
     * This is the callback for the method that creates a folder in the current activeFolderId directory.
     */
    const createFolderCallback = useCallback((folderName: string) => {
        let parsed = loadedFilesystem ? JSON.parse(loadedFilesystem) : undefined
        let newFilesystemOutput = createFolder(activeFolderId, folderName, parsed)
        if(newFilesystemOutput === undefined)
            return

        let newFilesystem = newFilesystemOutput.filesystem
        setLoadedFilesystem(JSON.stringify(newFilesystem))
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
        let parsed = JSON.parse(loadedFilesystem)
        let newFilesystem = deleteFolder(
            folderId, 
            parsed, 
            addDeleteSynchroMessage,
            setItemActive,
            addCloseFileIdTabBulk
        )

        setLoadedFilesystem(JSON.stringify(newFilesystem))
    }, [loadedFilesystem, addDeleteSynchroMessage, setItemActive])

    /**
     * NOTE: This method is to only be used within the form components.
     * This is the callback for the method that creates a file in the activeFolderID's directory
     */
    const createFileCallback = useCallback((fileName: string, fileType: string) => {
        let parsed = loadedFilesystem ? JSON.parse(loadedFilesystem) : undefined
        let newFilesystem = createFile(
            parsed, 
            activeFolderId, 
            fileName, 
            fileType, 
            addCreateSynchroMessage,
        )

        let sigmyzeFilesystem = newFilesystem.filesystem
        if(sigmyzeFilesystem === undefined || newFilesystem.fileId === "null")
            return
        
        setLoadedFilesystem(JSON.stringify(sigmyzeFilesystem))
        openTabCallback(newFilesystem.fileId, JSON.stringify(sigmyzeFilesystem))
    }, [addCreateSynchroMessage, openTabCallback, loadedFilesystem, activeFolderId])

    /**
     * NOTE: This method is shared out through the context.
     * This is the callback for the function that sets the requested folder's openState
     */
    const setFolderOpenStateCallback = useCallback((folderId: string, openState: boolean) => {
        let parsed = loadedFilesystem ? JSON.parse(loadedFilesystem) : undefined
        let newFilesystem = setFolderOpenState(parsed, folderId, openState)
        if(newFilesystem === undefined)
            return

        setLoadedFilesystem(JSON.stringify(newFilesystem))
    }, [loadedFilesystem])

    const value: ILunarUIState = useMemo(() => ({
        portalButtons,
        activeItemId,
        activeFile,
        loadedFilesystem: loadedFilesystem ? JSON.parse(loadedFilesystem) : undefined,
        debugMode,
        editorDebugMode,
        messagesLeft: synchroQueueLength,
        addQueueLength: messages,
        tabs,
        activeTab,
        setActiveTab,
        addIndicator,
        consumeIndicator,
        setItemActive,
        resetActive,
        setLoadedFilesystem: (x: ISigmyzeFilesystem | undefined) => setLoadedFilesystem(x ? JSON.stringify(x) : undefined),
        consumeSynchroMessage,
        setFolderOpenState: setFolderOpenStateCallback,
        openTab: openTabCallback,
        closeTab: closeTabCallback,
        getFileById,
        editFileTitle,
        delMessages,
        deleteIndicator,
        consumeDELIndicator,
        openDeleteIndicatorFlow
    }), [
        portalButtons,
        activeItemId,
        activeFile,
        loadedFilesystem,
        debugMode,
        editorDebugMode,
        synchroQueueLength,
        tabs,
        messages,
        activeTab,
        setItemActive,
        resetActive,
        consumeSynchroMessage,
        setFolderOpenStateCallback,
        openTabCallback,
        closeTabCallback,
        getFileById,
        editFileTitle,
        delMessages,
        openDeleteIndicatorFlow
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