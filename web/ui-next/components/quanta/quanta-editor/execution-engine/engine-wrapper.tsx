import { ContextModalProps, ModalsProvider } from "@mantine/modals"
import { useContext, useEffect, useState } from "react"
import ExecuteNodeGraph from "."
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { IQuantaRFEdge } from "../types/edges"
import { IQuantaFormField } from "../types/form"
import { IQuantaRFNode } from "../types/nodes"
import { IQuantaStore } from "../types/store"
import CallstackWrapper from "./callstack-wrapper"
import { ICallStackFunc } from "./types"

interface IEngineModalProps {
    forms: IQuantaFormField[],
    submit: (forms: IQuantaFormField[], valStore: {[key: string]: any}) => void
}

const EngineModal = ({ context, id, innerProps }: ContextModalProps<IEngineModalProps>) => {    
    return (
        <>
            <FormBuilder
                forms={innerProps.forms}
                closeModal={() => context.closeModal(id)}
                submit={innerProps.submit}
            />
        </>
    )
}

interface IEngineWrapperProps {
    subscribeExecute?: boolean,
    engineCacheToggle: boolean,
    nodes?: IQuantaRFNode[],
    edges?: IQuantaRFEdge[],
    store?: IQuantaStore
}

const EngineWrapper: React.FC<IEngineWrapperProps> = ({ subscribeExecute, engineCacheToggle, nodes, edges, store }) => {
    const [internalNodes, setInternalNodes] = useState<IQuantaRFNode[]>([])
    const [internalEdges, setInternalEdges] = useState<IQuantaRFEdge[]>([])
    const [internalStore, setInternalStore] = useState<IQuantaStore | undefined>(undefined)

    const [callStack, setCallStack] = useState<ICallStackFunc[]>([])

    const [execute, setExecute] = useState(false)
    const toggleExecute = () => setExecute(!execute)

    const [executeCache, setExecuteCache] = useState(false)
    const toggleExecuteCache = () => setExecuteCache(!executeCache)

    const { loggedIn, loaded } = useContext(UserContextData) as IUserContext

    useEffect(() => {
        if(internalStore === undefined)
            return
        if(loaded === false || loggedIn === false)
            return

        let callStack = ExecuteNodeGraph(internalNodes, internalEdges, internalStore)
        setCallStack([ ...callStack ])
        toggleExecute()
    }, [subscribeExecute])

    useEffect(() => {
        if(internalStore === undefined)
            return
        if(loaded === false || loggedIn === false)
            return

        let callStack = ExecuteNodeGraph(internalNodes, internalEdges, internalStore)
        setCallStack([ ...callStack ])
        toggleExecuteCache()
    }, [engineCacheToggle])

    //effect hook to set the internal nodes
    useEffect(() => {
        if(nodes === undefined)
            return

        setInternalNodes([ ...nodes ]) 
    }, [nodes])

    //effect hook to set the internal edges
    useEffect(() => {
        if(edges === undefined)
            return

        setInternalEdges([ ...edges ])
    }, [edges])

    useEffect(() => {
        if(store === undefined)
            return

        setInternalStore({ ...store })
    }, [store]) 
    
    return (
        <>
            <CallstackWrapper 
                callStack={callStack}
                execute={execute}    
                executeCache={executeCache}
                edges={internalEdges}        
            />

            <ModalsProvider modals={{ engineModal: EngineModal }}>
                
            </ModalsProvider>
        </>
    )
}

export type { IEngineModalProps }
export default EngineWrapper