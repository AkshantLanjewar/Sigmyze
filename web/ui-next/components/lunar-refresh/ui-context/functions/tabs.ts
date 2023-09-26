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
    setActiveTab: (tabId: string | null) => void
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
}

export { openTab }