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
    paneId: string,
    paneContent: JSX.Element
}

export type { 
    ILunarTab,
    ILunarPane 
}