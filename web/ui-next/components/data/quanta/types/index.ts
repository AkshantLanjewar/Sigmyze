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

    //tab related functions
    changeTab: (tabId: string) => void,
    focusTab: (fileId: string, fileType: string) => void,
    closeTab: (tabId: string) => void
}

export type { IQuantaState }