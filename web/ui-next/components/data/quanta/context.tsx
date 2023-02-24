import { createContext, useState } from "react"
import { IQuantaState } from "./types"
import { IQuantaProjectData } from "./types/project"

interface IQuantaContextProps {
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ children }) => {
    const [projectData, setProjectData] = useState<IQuantaProjectData | undefined>(undefined)

    let value: IQuantaState = {} as IQuantaState
    value.project_data = projectData

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

export default QuantaContext