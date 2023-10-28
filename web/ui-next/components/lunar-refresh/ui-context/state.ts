import { Dispatch, SetStateAction } from "react";
import { IPortalButton } from "../types";
import { ISigmyzeFile, ISigmyzeFilesystem } from "../../ui/file-management/types";
import { ISynchroMessage } from "./types";
import { ILunarTab } from "../page/viewport/types";

/**
 * theese are the components that are shared from the Lunar UI Context
 */
interface ILunarUIState {
    /**
     * theese are the active portal buttons being rendered in the sidebar component
     */
    portalButtons: IPortalButton[],

    /**
     * this is the active item within the filetree viewer in the explorer
     */
    activeItemId: string | undefined,

    /**
     * this is the filesystem that is being displayed within the explorer
     * NOTE: it is not advised to edit this data structure directly, but to use the many helper functions in the data-manager folder
     */
    loadedFilesystem: ISigmyzeFilesystem | undefined,

    /**
     * this is whether or not the component is in debug mode.
     * Certain features, such as loading in projects based on the url will be turned off when debugMode is enabled
     */
    debugMode: boolean,

    /**
     * This is whether or not the editor is in debug mode.
     * Used for testing only.
     */
    editorDebugMode: boolean,

    /**
     * theese are how many synchro messages are left for the data context to consume.
     * other components may hook onto it, but this is primarliy meant as a pipe between the UI context and the data context.
     */
    messagesLeft: number,

    /**
     * theese are the tabs that are opened within the lunar viewport
     */
    tabs: ILunarTab[],

    /**
     * this is the active tab for the tab view
     */
    activeTab: string | null,

    /**
     * this is the function that can change the active tab
     * @param activeTab 
     *  - the new value for the active tab state.
     */
    setActiveTab: (activeTab: string | null) => void,

    /**
     * this is the function that sets which nodeId should be active within the file tree displayed in the explorer.
     * @param itemId 
     *  this is the id of the item we want to be set active
     * @param itemType 
     *  this is the type of object being set active, so other parameters, such as portal buttons and active folder may be correctly set as well
     */
    setItemActive: (itemId: string, itemType: string) => void,

    /**
     * this resets the file tree explorer, and sets the active item to be the root project folder.
     */
    resetActive: () => void,

    /**
     * this is the method that allows you to edit the explorer's filesystem datastructure.
     */
    setLoadedFilesystem: Dispatch<SetStateAction<ISigmyzeFilesystem | undefined>>,

    /**
     * This function pops the first synchro message off the synchro messages and returns it, if there is a message
     */
    consumeSynchroMessage: () => ISynchroMessage | undefined,

    /**
     * this is the function that helps folders persist their open / close state to memory
     * @param folderId 
     *  this is the id of the folder of who's state we are trying to persist
     * @param openState 
     *  this is the open state of the folder, wether it is opened or not
     */
    setFolderOpenState: (folderId: string, openState: boolean) => void,

    /**
     * this is the function that opens a tab within the viewport
     * @param fileId    
     *  - the id of the file who we want to open a tab for
     */
    openTab: (fileId: string) => void

    /**
     * this is the function that closes a tab
     * @param tabId 
     *  - the id of the tab to be closed
     */
    closeTab: (tabId: string) => void

    /**
     * this is the function that gets a file by its id
     * @param fileId
     *  - this is the fileId of the file we want
     */
    getFileById: (fileId: string) => ISigmyzeFile | undefined,
    editFileTitle: (fileId: string, fileType: string, newTitle: string) => void
}

export type { ILunarUIState }