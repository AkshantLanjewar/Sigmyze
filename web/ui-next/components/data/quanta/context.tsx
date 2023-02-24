import { createContext } from "react"
import { IQuantaState } from "./types"

interface IQuantaContextProps {
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ children }) => {
    let value: IQuantaState = {} as IQuantaState

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