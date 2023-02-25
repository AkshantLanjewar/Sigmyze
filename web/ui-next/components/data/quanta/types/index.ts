import { IQuantaFile, IQuantaProjectData } from "./project"
import { IQuantaTab } from "./ui"

interface IQuantaState {
    /**
     * This is the actual project data for the project.
     * This is the component that is stored on the server aswell.
     */
    project_data?: IQuantaProjectData,

    /**
     * This is the active tab state for the ui
     */
    tabId?: string,

    /**
     * Theese are the tabs for the viewport 
     */
    tabs?: IQuantaTab[],

    /**
     * this is the active selector_id for the selector view
     */
    activeSelectorId?: string | null,

    //tab related functions
    changeTab: (tabId: string) => void,
    focusTab: (fileId: string, fileType: string) => void,
    closeTab: (tabId: string) => void,

    //text changing related functions
    changeText: (text: string, field: "title" | "id" | "desc") => void,

    //opens a context modal
    openModal: (modalId: string) => void

    //opens the specified selector in the selectors view
    openSelector: (selectorId: string) => void
    //activeates selector
    activateSelector: (selectorId: string) => void
}

export type { IQuantaState }