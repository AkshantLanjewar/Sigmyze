import { createContext, useContext, useEffect, useState } from "react"
import { ISelectorPaneState } from "./types"
import { v4 } from "uuid"
import { SocketHandlerData } from "../../../ui/socket-handler"
import { ISocketHandlerState } from "../../../ui/socket-handler/types"
import { compileProject, initExecutionContext } from "./functions"
import SelectorFrameTester from "../selector-frame-tester"
import { IQuantaSelectorCode } from "../../../data/quanta/types/project"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"

const SelectorPaneContextData = createContext<ISelectorPaneState | null>(null)

interface ISelectorPaneProps {
    selectorId: string,
    extSelectorCode?: IQuantaSelectorCode
    children?: React.ReactNode
}

const SelectorPaneContext: React.FC<ISelectorPaneProps> = ({ selectorId, extSelectorCode, children }) => {
    const [initialized, setInitialized] = useState(false)
    const [compilationId, setCompilationId] = useState(v4())
    
    //relates to testing the selectors code
    const [testSource, setTestSource] = useState<string | null>(null)
    const [selectorCode, setSelectorCode] = useState<IQuantaSelectorCode | null>(null)

    const { socketCreated, executeSocketFunction } = useContext(SocketHandlerData) as ISocketHandlerState
    const { addSelectorSource } = useContext(QuantaContextData) as IQuantaState
    
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

    useEffect(() => {
        if(extSelectorCode === undefined)
            return
        if(selectorCode !== null)
            return

        setSelectorCode({ ...extSelectorCode })
    }, [extSelectorCode])

    useEffect(() => {
        if(selectorCode === null)
            return

        setTestSource(null)
        addSelectorSource(selectorId, selectorCode)
    }, [selectorCode])

    let value = {} as ISelectorPaneState
    value.initialized = initialized
    value.selectorCode = selectorCode

    value.setTestSource = setTestSource
    value.setSelectorCode = setSelectorCode

    value.compileProject = (projectData: string) =>
        compileProject(compilationId, projectData, executeSocketFunction)

    return (
        <>
            <SelectorPaneContextData.Provider value={value}>
                <div style={{ width: '100%', height: '100%' }}>
                    <SelectorFrameTester 
                        source={testSource} 
                        selectorId={selectorId}
                    />

                    {children}
                </div>
            </SelectorPaneContextData.Provider>
        </>
    )
}

export { SelectorPaneContextData }
export default SelectorPaneContext