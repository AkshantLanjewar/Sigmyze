import { v4 } from "uuid"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { grabFile } from "../../data-manager/functions"
import { ILunarTab } from "../../page/viewport/types"

/**
 * @description
 *  - this is the function that handles the opening of a tab within the Sigmyze Viewport.
 *  - if there is already a tab that has been created, it simply focuses the tab instead
 * @param filesystem
 *  - this is the filesystem where the file is located
 * @param fileId
 *  - this is the fileId for the tab we want to create a file for
 * @param tabs
 *  - theese are the tabs that are currently used in the editor
 * @param setTabs
 *  - this is the function that allows us to update the tabs within the editor
 */
const openTab = (
    filesystem: ISigmyzeFilesystem, 
    fileId: string,
    tabs: ILunarTab[],
    setTabs: (tabs: ILunarTab[]) => void,
    setActiveTab: (tabId: string | null) => void,
    setItemActive: (itemId: string, itemType: string) => void
) => {
    let file = grabFile(filesystem, fileId)
    if(file === undefined)
        return

    //now we need to check if the fileId has already been created within the viewport, if it has we want to focus it
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.fileId === fileId) {
            //we want to focus and set this tab as active now
            setActiveTab(tab.tabId)
            return
        }
    }

    //we need to get the splitted type
    let typeSplit = file.fileType.split("::")
    let fileType = typeSplit[1]

    //now we need to createa new tab to insert
    const newTab: ILunarTab = {
        tabName: file.fileName,
        fileId: file.fileId,
        tabType: fileType,
        tabId: v4()
    }
    
    //insert and update the tabs
    let newTabs = [ ...tabs, newTab ]
    setTabs([ ...newTabs ])
    setActiveTab(newTab.tabId)
    //now we want to set the active file aswell so the sidepanel updates in sync
    setItemActive(file.fileId, fileType)
}

/**
 * @description
 *  - this function handles the closing of a tab, and if the tab was active, left shift the current active tab to the tab that was to the left.
 * @param tabId 
 *  - this is the id of the tab we are going to delete
 * @param tabs 
 *  - this is the list of active tabs within the editor
 * @param activeItemId
 *  - this is the active file or folder within the ui-context
 * @param setTabs
 *  - this is the function that allows us to update the tabs within the editor
 * @param resetActive
 *  - this function resets the active item to the root folder
 */
const closeTab = (
    tabId: string, 
    tabs: ILunarTab[],
    activeItemId: string | null,
    setTabs: (tabs: ILunarTab[]) => void,
    resetActive: () => void
) => {
    let newTabs: ILunarTab[] = []
    //we want to make a copy of the tab list so we can handle the left-shift later
    let tabsCopy = tabs
    //we want to store the delete index for the later left-shift
    let deleteIndex: number | undefined = undefined

    //we will first go through and delete the tab from the tab list
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.tabId === tabId) {
            deleteIndex = i
            continue
        }

        newTabs.push(tab)
    }

    if(deleteIndex === undefined)
        return

    setTabs([ ...newTabs ])
    //if the tab is active, we want to shift the active tab over 1 space to the left
    if(tabId === activeItemId) {
        let newActiveIndex: number | undefined = 0

        //if there are no tabs we want to reset the active item to the root folder
        if(newTabs.length === 0) {
            resetActive()
            newActiveIndex = undefined
        }
        //if the delete index was at the end of the list, we want to set the active index to deleteIndex - 1
        else if(deleteIndex === tabsCopy.length - 1)
            newActiveIndex = deleteIndex - 1
        else if(deleteIndex !== tabsCopy.length - 1)
            newActiveIndex = deleteIndex

        //if there is an active index, we want to set the focus to that tab
        if(newActiveIndex !== undefined) {
            let newActiveTab = newTabs[newActiveIndex]
            return newActiveTab
        }
    }
}

export { 
    openTab,
    closeTab 
}