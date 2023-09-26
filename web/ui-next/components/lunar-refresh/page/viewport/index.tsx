import { useContext, useState } from "react"
import LunarViewportView from "./view"
import { LunarUIContextData } from "../../ui-context"
import { ILunarUIState } from "../../ui-context/state"

interface ILunarViewportProps {

}

const LunarViewport: React.FC<ILunarViewportProps> = ({ }) => {
    const { activeTab, tabs, setActiveTab } = useContext(LunarUIContextData) as ILunarUIState
    
    return (
        <LunarViewportView 
            activeTab={activeTab}
            tabs={tabs}
            setActiveTab={setActiveTab}
        />
    )
}

export default LunarViewport