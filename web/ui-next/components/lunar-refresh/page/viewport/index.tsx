import { useContext, useEffect, useState } from "react"
import LunarViewportView from "./view"
import { LunarUIContextData } from "../../ui-context"
import { ILunarUIState } from "../../ui-context/state"
import { ILunarPane } from "./types"

interface ILunarViewportProps { }

const LunarViewport: React.FC<ILunarViewportProps> = ({ }) => {
    //this is a list of all the panes within the current viewport
    const [panes, setPanes] = useState<ILunarPane[]>([])
    //this is the active pane type
    const [paneType, setPaneType] = useState<string | undefined>(undefined)

    const { activeTab, tabs, setActiveTab, closeTab } = useContext(LunarUIContextData) as ILunarUIState

    /**
     * this effect handles the creation of the panes, based on the opened tabs
     */
    useEffect(() => {
        let newPanes: ILunarPane[] = []
        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            let newPane = { 
                paneId: tab.tabId, 
                paneType: tab.tabType 
            } as ILunarPane

            //now we need to compute what jsx will be on there for the tab's content
            switch(tab.tabType) {
                default:
                    newPane.paneContent = <div />
            }

            newPanes.push(newPane)
        }

        setPanes([ ...newPanes ])
    }, [tabs])

    //TODO: Implement a system where we can get the pane type so we can add it to the div cuz mantine :(
    useEffect(() => {
        let activePane: ILunarPane | undefined = undefined
        if(activeTab === undefined) {
            setPaneType(undefined)
            return
        }

        //loop through the panes to find the active pane
        for(let i = 0; i < panes.length; i++) {
            let pane = panes[i]
            if(pane.paneId === activeTab)
                activePane = pane
        }

        setPaneType(activePane?.paneType)
    }, [activeTab, panes])

    return (
        <LunarViewportView 
            activeTab={activeTab}
            tabs={tabs}
            panes={panes}
            paneType={paneType}
            setActiveTab={setActiveTab}
        />
    )
}

export default LunarViewport