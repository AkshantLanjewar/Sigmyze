import { createContext, useEffect, useState } from "react"
import { IQuantaState } from "./types"
import { IQuantaProjectData } from "./types/project"
import { DefaultQuantaProject } from "./utils"

interface IQuantaContextProps {
    quantaId?: string,
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ quantaId, children }) => {
    const [projectData, setProjectData] = useState<IQuantaProjectData | undefined>(undefined)

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId])

    //function that loads the quanta data
    function loadQuanta() {
        if(quantaId === undefined)
            setProjectData({ ...DefaultQuantaProject() })
    }

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

export { QuantaContextData }
export default QuantaContext