import { useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { IQuantaRFEdge } from "../types/types"
import { ExecutionContextData } from "./context"
import { IExecutionEngineContext } from "./context/types"
import fileUploadNode from "./nodes/file-upload"
import startNode from "./nodes/start"
import { ICallStackFunc, IInputValueResp } from "./types"

interface ICallstackWrapperProps {
    callStack?: ICallStackFunc[],
    execute?: boolean,
    edges: IQuantaRFEdge[]
}

const CallstackWrapper: React.FC<ICallstackWrapperProps> = ({ callStack, execute, edges }) => {
    const [executedNodes, setExecutedNodes] = useState<string[]>([])
    const [processId, setProcessId] = useState(v4())

    const { 
        socketCreated, 
        setOutputValueSocket,
        getOutputValueSocket 
    } = useContext(ExecutionContextData) as IExecutionEngineContext

    useEffect(() => {
        if(execute === undefined)
            return
        if(socketCreated !== true)
            return

        async function execute() {
            if(callStack === undefined)
                return

            for(let i = 0; i < callStack.length; i++) {
                let stack = callStack[i]
                await executeNode(stack)
            }
        }

        setExecutedNodes([])
        execute()
    }, [execute])

    function addExecutedNode(id: string) {
        let nExecutedNodes = executedNodes
        nExecutedNodes.push(id)

        setExecutedNodes([ ...nExecutedNodes ])
    }

    function findStack(nodeId: string) {
        let stack = undefined
        if(callStack === undefined)
            return

        for(let i = 0; i < callStack.length; i++) {
            let stack_ = callStack[i]
            if(stack_.nodeId === nodeId)
                stack = stack_
        }

        return stack
    }

    function setOutputValue(nodeId: string, socketId: string, val: any) {
        let promise = new Promise((resolve, reject) => {
            function handler(val: string) {
                console.debug(`set ${socketId}`)
                resolve(true)
            }
            
            setOutputValueSocket(processId, nodeId, socketId, val, handler)
        })

        return promise
    }

    function getInputValue(nodeId: string, socketId: string) {
        let edge: IQuantaRFEdge | undefined = undefined
        for(let i = 0; i < edges.length; i++) {
            let edge_ = edges[i]
            if(edge_.target === nodeId && edge_.targetHandle === socketId)
                edge = edge_
        }

        let promise = new Promise((resolve, reject) => {
            if(edge === undefined)
            {
                resolve(undefined)
                return
            }

            function handler(val: string) {
                console.debug(`retreived ${socketId}`)
                let data: IInputValueResp = JSON.parse(val)
                resolve(data.value)
            }

            getOutputValueSocket(processId, edge.source!, edge.sourceHandle!, handler)
        })

        return promise
    }

    async function executeNode(stack: ICallStackFunc) {
        let executionId = `${stack.functionId}:${stack.nodeId}`
        let dependencies = stack.dependencies
        if(executedNodes.includes(executionId))
            return

        for(let i = 0; i < dependencies.length; i++) {
            let dependency = dependencies[i]
            let dependentStack = findStack(dependency)
            if(dependentStack === undefined)
                continue

            await executeNode(dependentStack)
        }

        try {
            switch(stack.functionId) {
                case "start":
                    await startNode(stack, setOutputValue)
                    break
                case "file_upload":
                    let promise = await fileUploadNode(stack, getInputValue, setOutputValue)
                    await promise

                    break
                case "sdmx_data_parser":
                    
                    break
                default:
                    break
            }
        } catch (error) {
            console.debug(`error -> ${error}`)
        }

        addExecutedNode(executionId)
    }

    return (
        <>
        
        </>
    )
}

export default CallstackWrapper