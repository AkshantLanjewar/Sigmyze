import { createContext } from "react"
import { IQuantaIndicatorManager } from "./types"

const QuantaIndicatorManagerData = createContext<IQuantaIndicatorManager | null>(null)

interface IQuantaIndicatorManagerProps {
    children?: JSX.Element | never[]
}

const QuantaIndicatorManager: React.FC<IQuantaIndicatorManagerProps> = ({ children }) => {
    let value: IQuantaIndicatorManager = {}

    return (
        <>
            <QuantaIndicatorManagerData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </QuantaIndicatorManagerData.Provider>
        </>
    )
}

export default QuantaIndicatorManager