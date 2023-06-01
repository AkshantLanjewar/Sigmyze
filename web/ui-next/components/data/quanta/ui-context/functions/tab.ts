import { Dispatch, SetStateAction } from "react"
import { v4 } from "uuid"
import { IQuantaTab } from "../../types/ui"
import { IQuantaFile, IQuantaProjectData } from "../../types/project"
import { IQuantaCodeShort } from "../../quanta-code-context/types"
import { ITreeNode } from "../../../../tree/tree"

const changeTab = ( 
    tabId: string, 
    activeTab: string | undefined, 
    setActiveTab: Dispatch<SetStateAction<string | undefined>>
) => {
    if(tabId === activeTab)
        return
        
    setActiveTab(tabId)
}

const focusTab = (
    fileId: string, 
    fileType: string, 
    tabs: IQuantaTab[], 
    projectData: IQuantaProjectData | undefined,
    codeItems: IQuantaCodeShort[],
    setTabs: Dispatch<SetStateAction<IQuantaTab[]>>,
    setActiveTab: Dispatch<SetStateAction<string | undefined>>
) => {
    let relatedTab = undefined
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.connected_file === fileId)
            relatedTab = tab.tabId
    }

    if(relatedTab === undefined) {
        //get the linked file
        let files = projectData?.files
        let file = undefined
        if(files === undefined)
            return

        for(let i = 0; i < codeItems.length; i++) {
            let codeItem = codeItems[i]
            let fileNode = {
                id: codeItem.code_id,
                name: codeItem.short,
                type: "code::selector",
            } as IQuantaFile 

            files.push(fileNode)
        }

        for(let i = 0; i < files.length; i++) {
            let _file = files[i]
            if(_file.id === fileId)
                file = _file
        }

        if(file === undefined)
            return
        let newTab = {
            connected_file: fileId,
            tabId: v4(),
            tabType: fileType,
            tabName: file.name
        } as IQuantaTab

        let nTabs = tabs
        nTabs.push(newTab)

        relatedTab = newTab.tabId!
        setTabs([ ...nTabs ])
    }

    setActiveTab(relatedTab)
}

const closeTab = (
    tabId: string, 
    tabs: IQuantaTab[], 
    activeTab: string | undefined,
    setTabs: Dispatch<SetStateAction<IQuantaTab[]>>,
    setActiveTab: Dispatch<SetStateAction<string | undefined>> 
) => {
    let nTabs = []
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        if(tab.tabId === tabId)
            continue

        nTabs.push(tab)
    }

    setTabs([ ...nTabs ])

    if(tabId === activeTab) {
        let activeIndex = 0
        for(let i = 0; i < tabs.length; i++) {
            if(tabs[i].tabId === activeTab)
                activeIndex = i
        }

        if(activeIndex > 0)
            activeIndex = activeIndex - 1

        if(nTabs.length > 0)
            setActiveTab(nTabs[activeIndex].tabId)
        else
            setActiveTab(undefined)
    }
}

export { 
    changeTab,
    focusTab,
    closeTab 
}