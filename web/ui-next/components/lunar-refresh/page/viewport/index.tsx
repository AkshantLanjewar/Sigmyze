import { useContext, useEffect, useState } from "react"
import LunarViewportView from "./view"
import { LunarUIContextData } from "../../ui-context"
import { ILunarUIState } from "../../ui-context/state"
import { ILunarPane } from "./types"

interface ILunarViewportProps { }

const LunarViewport: React.FC<ILunarViewportProps> = ({ }) => {
    //this is a list of all the panes within the current viewport
    const [panes, setPanes] = useState<ILunarPane[]>([])

    const { activeTab, tabs, setActiveTab } = useContext(LunarUIContextData) as ILunarUIState

    useEffect(() => {
        let newPanes: ILunarPane[] = []
        for(let i = 0; i < tabs.length; i++) {
            let tab = tabs[i]
            let newPane = { paneId: tab.tabId } as ILunarPane

            //now we need to compute what jsx will be on there for the tab's content
            switch(tab.tabType) {
                default:
                    newPane.paneContent = <div />
            }

            newPanes.push(newPane)
        }

        setPanes([ ...newPanes ])
    }, [tabs])
    
    return (
        <LunarViewportView 
            activeTab={activeTab}
            tabs={tabs}
            panes={panes}
            setActiveTab={setActiveTab}
        />
    )
}

export default LunarViewport