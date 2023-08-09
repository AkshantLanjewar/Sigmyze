import { WebContainer } from "@webcontainer/api";
import { IQuantaTab } from "../types/ui";

interface IQuantaUIState {
    /**
     * This is the active tab state for the ui
     */
    tabId?: string,

    /**
     * Theese are the tabs for the viewport 
     */
    tabs?: IQuantaTab[],

    /**
     * This is whether or not the webcontainer has been created
     */
    webcontainerCreated: boolean,

    //tab related functions
    changeTab: (tabId: string) => void,
    focusTab: (fileId: string, fileType: string) => void,
    closeTab: (tabId: string) => void,

    //opens a context modal
    openModal: (modalId: string) => void,
    //method that retrieves the webcontainer
    getContainer: () => WebContainer | null
}

export type { IQuantaUIState }