/**
 * this is the datastructure definition for a lunar tab within the lunar view
 */
interface ILunarTab {
    /**
     * this is the name for the tab
     */
    tabName: string,

    /**
     * this is the unique id for the tab
     */
    tabId: string,

    /**
     * this is the type for the tab, used for the tab icon
     */
    tabType: string,

    /**
     * this is the file id the tab links to
     */
    fileId: string
}

/**
 * this is the data structure definition for a lunar pane that corresponds to a lunar tab
 */
interface ILunarPane {
    /**
     * this is the linked tabId in order to sync up with the tabs
     */
    paneId: string,

    /**
     * this is the type of the pane, used to set the testValue of a tabpane
     */
    paneType: string,

    /**
     * this is the jsx element that we want to be stored within the lunar pane
     */
    paneContent: JSX.Element,

    /**
     * This is the optional background color for the tab pane
     */
    backgroundColor?: string
}

export type { 
    ILunarTab,
    ILunarPane 
}