import { createContext, useContext, useEffect, useState } from "react"
import { ISelectorPaneState } from "./types"
import { v4 } from "uuid"
import { SocketHandlerData } from "../../../ui/socket-handler"
import { ISocketHandlerState } from "../../../ui/socket-handler/types"
import { initExecutionContext } from "./functions"

const SelectorPaneContextData = createContext<ISelectorPaneState | null>(null)

interface ISelectorPaneProps {
    children?: React.ReactNode
}

const SelectorPaneContext: React.FC<ISelectorPaneProps> = ({ children }) => {
    const [initialized, setInitialized] = useState(false)
    const [compilationId, setCompilationId] = useState(v4())

    const { socketCreated, executeSocketFunction } = useContext(SocketHandlerData) as ISocketHandlerState
    
    useEffect(() => {
        async function main() {
            if(socketCreated === false)
                return

            await initExecutionContext(
                compilationId,
                setInitialized,
                executeSocketFunction
            )
        }

        main()
    }, [socketCreated])

    let value = {} as ISelectorPaneState
    value.initialized = initialized

    return (
        <>
            <SelectorPaneContextData.Provider value={value}>
                <div style={{ width: '100%', height: '100%' }}>
                    {children}
                </div>
            </SelectorPaneContextData.Provider>
        </>
    )
}

export { SelectorPaneContextData }
export default SelectorPaneContext