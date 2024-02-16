import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { ILunarTab } from "../../page/viewport/types"
import { closeTab, closeTabFileId, openTab } from "../functions"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { grabFile } from "../../data-manager/functions"

/**
 * @description
 *  - this is the hook that handles the management of the tabs within the UI context
 * 
 * @emits tabs
 *  - these are the tabs loaded within the UI
 * @emits setTabs
 *  - this is the function that sets the loaded tabs within the editor
 * @emits activeTab
 *  - this is the active tab within the editor
 * @emits setActiveTab
 *  - this is the function that sets the active tab within the UI
 * @emits closeTabQueue
 *  - this is the queue that handles bulk closing of tabs (REF)
 * @emits closeTabLength
 *  - this is the length of the closeTabQueue
 * @emits closeTabCallback
 *  - this is the function that can close a tab within the editor
 * @emits openTabCallback
 *  - this is the function that can open a tab within the editor
 * @emits closeTabFileIdCallback
 *  - this is the function that closes a tab based on its fileId
 * @emits addCloseFileIdTabBulk
 *  - this is the function that adds a bulk amount of closeIdRequests
 * @emits consumeFileIdCloseQueue
 *  - this is the function that consumes a fileId from the closeQueue
 */
const useUITabs = (
    loadedFilesystem: string | undefined,
    setItemActive: (itemId: string, itemType: string) => void,
    resetActive: () => void
) => {
    //this is the list of all the active tabs within the viewport
    const [tabs, setTabs] = useState<ILunarTab[]>([])
    //this is the state which will determine which tab in the potential tablist will be active
    const [activeTab, setActiveTab] = useState<string | null>(null)
    //this is the ref that is the queue for closing tabs
    const closeTabQueue = useRef<string[]>([])
    //this is the length of the closeTabQueue, used to handle the consumption of the queue
    const [closeTabLength, setCloseTabLength] = useState<number>(0)
    //this is the active file within the editor
    const [activeFile, setActiveFile] = useState<string | null>(null)

    /**
     * NOTE: This method is shared out through the context.
     * This is the callback for the function that opens a tab
     */
    const openTabCallback = useCallback((fileId: string, rawData?: string) => {
        if(loadedFilesystem === undefined)
            return
        
        let parsed: ISigmyzeFilesystem = JSON.parse(loadedFilesystem)
        if(rawData !== undefined)
            parsed = JSON.parse(rawData)

        openTab(parsed, fileId, tabs, setTabs, setActiveTab, setItemActive)
    }, [loadedFilesystem, tabs])

    /**
     * NOTE: This method is shared throghout the context.
     * This is the callback for the function that closes a tab
     */
    const closeTabCallback = useCallback((tabId: string) => {
        let newTab = closeTab(tabId, tabs, activeTab, setTabs, resetActive)
        if(newTab === undefined)
            return

        openTabCallback(newTab.fileId)
    }, [tabs, activeTab, openTabCallback, resetActive])

    /**
     * NOTE: This method is to only be used within this file.
     * This is the callback for the function that closes a tab based on its associated fileId.
     */
    const closeTabFileIdCallback = useCallback((fileId: string) => {
        let newTab = closeTabFileId(fileId, tabs, activeTab, setTabs, resetActive)
        if(newTab === undefined)
            return

        openTabCallback(newTab.fileId)
    }, [tabs, activeTab, openTabCallback, resetActive])

    /**
     * NOTE: Meant to only be used within the context.
     * @description
     *  - this is the function that adds a bulk amount of fileId's to the close tab queue
     */
    const addCloseFileIdTabBulk = useCallback((fileIds: string[]) => {
        let newCloseTabQueue = closeTabQueue.current
        for(let i = 0; i < fileIds.length; i++) {
            let fileId = fileIds[i]
            newCloseTabQueue.push(fileId)
        }

        closeTabQueue.current = newCloseTabQueue
        setCloseTabLength(newCloseTabQueue.length)
    }, [])

    /**
     * NOTE: Meant to only be used within the context.
     * @description
     *  - this is the function that consumes a fileId in the closeFileIdTabQueue
     */
    const consumeFileIdCloseQueue = useCallback(() => {
        let queueValue = closeTabQueue.current
        let consumedValue = queueValue.shift()
        closeTabQueue.current = queueValue

        setCloseTabLength(queueValue.length)
        return consumedValue
    }, [])

    //this is the effect that sets the active fileId
    useEffect(() => {
        setActiveFile(null)
        if(activeTab === null)
            return

        let activeFileId: string | undefined = undefined
        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            if(tab.tabId === activeTab)
                activeFileId = tab.fileId
        }

        if(activeFileId === undefined)
            return

        setActiveFile(activeFileId)
    }, [tabs, activeTab])

    //effect that consumes a close tab queue (fileId)
    useEffect(() => {
        if(closeTabLength === 0)
            return

        let consumedValue = consumeFileIdCloseQueue()
        if(consumedValue === undefined)
            return

        closeTabFileIdCallback(consumedValue)
    }, [closeTabLength])

    /**
     * This is an effect that reconstructs the tab name's based on any change to the filesystem (may have performance impacts)
     */
    useEffect(() => {
        if(loadedFilesystem === undefined)
            return

        //iterate through the tabs that are currently open
        let newTabs: ILunarTab[] = []
        let parsed: ISigmyzeFilesystem = JSON.parse(loadedFilesystem)
        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            let tabFileId = tab.fileId

            //get the new file
            let file = grabFile(parsed, tabFileId)
            if(file === undefined)
                continue

            tab.tabName = file.fileName
            newTabs.push(tab)
        }

        //set the updated tabs
        setTabs([ ...newTabs ])
    }, [loadedFilesystem])

    return {
        tabs,
        activeTab,
        activeFile,
        closeTabQueue,
        closeTabLength,
        setTabs,
        setActiveTab,
        closeTabCallback,
        openTabCallback,
        closeTabFileIdCallback,
        addCloseFileIdTabBulk,
        consumeFileIdCloseQueue
    }
}

export default useUITabs