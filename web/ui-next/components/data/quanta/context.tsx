import { createContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { IQuantaState } from "./types"
import { IQuantaFile, IQuantaProjectData } from "./types/project"
import { IQuantaTab } from "./types/ui"
import { DefaultQuantaProject } from "./utils"

interface IQuantaContextProps {
    quantaId?: string,
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ quantaId, children }) => {
    const [projectData, setProjectData] = useState<IQuantaProjectData | undefined>(undefined)
    
    //state relating to the tabs
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
    const [tabs, setTabs] = useState<IQuantaTab[]>([] as IQuantaTab[])

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId])

    //function that loads the quanta data
    function loadQuanta() {
        if(quantaId === undefined) {
            let defaultProject = DefaultQuantaProject()
            setProjectData({ ...defaultProject })
        }
    }

    let value: IQuantaState = {} as IQuantaState
    value.project_data = projectData
    value.tabId = activeTab
    value.tabs = tabs

    //NOTE: Theese are the functions relating to the context
    
    //NOTE: This function changes the tab to the specified tabs string
    // meant to be used by the mantine component only
    value.changeTab = ( tabId: string ) => {
        if(tabId === activeTab)
            return
            
        setActiveTab(tabId)
    }

    //Note this function focuses to a tab within the editor
    // creates a tab if it does not exist
    value.focusTab = (fileId: string, fileType: string) => {
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

    value.closeTab = (tabId: string) => {
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

    return (
        <>
            <QuantaContextData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </QuantaContextData.Provider>
        </>
    )
}

export { QuantaContextData }
export default QuantaContext