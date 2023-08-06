import { useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import { IQuantaRFEdge } from "../types/types"
import { ExecutionContextData } from "./context"
import { IExecutionEngineContext } from "./context/types"
import fileUploadNode from "./nodes/file-upload"
import iterNode from "./nodes/iter"
import quantaLoop from "./nodes/loop"
import sdmxDataMapper from "./nodes/sdmx-data-mapper" 
import sdmxDataParserNode from "./nodes/sdmx-data-parser"
import startNode from "./nodes/start"
import { ICallStackFunc, IFunctionResp, IInputValueResp } from "./types"
import getSdmxFieldKey from "./nodes/get-sdmx-field-key"
import getSdmxFieldValue from "./nodes/get-sdmx-field-val"
import stringToDate from "./nodes/string-to-date"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import buildFields from "./nodes/build-fields"
import applyDataRule from "./nodes/apply-data-rule"
import addIndicator from "./nodes/add-indicator"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import { CreateExecutionCache, DeleteExecutionCache } from "../../../data/quanta/quanta-api"
import { showNotification } from "@mantine/notifications"
import { IFileUploadOutput, input_file_upload } from "./input-nodes"
import { IExecuteStackBody, IInternalStore, IInternalStorePreload } from "./nodes/types"
import { UploadProjectData } from "./callstack-api"
import updateIndicator from "./nodes/update-indicator"

interface ICallstackWrapperProps {
    callStack?: ICallStackFunc[],
    execute?: boolean,
    executeCache: boolean,
    edges: IQuantaRFEdge[]
}

const CallstackWrapper: React.FC<ICallstackWrapperProps> = ({ callStack, execute, executeCache, edges }) => {
    const [executedNodes, setExecutedNodes] = useState<string[]>([])
    const [failedNodes, setFailedNodes] = useState<string[]>([])
    const [processId, setProcessId] = useState(v4())

    const { getSchema, quantaId, organizationId, toggleUpdateEditorIndicators } = useContext(QuantaContextData) as IQuantaState
    const { authData } = useContext(UserContextData) as IUserContext

    const { 
        socketCreated, 
        setOutputValueSocket,
        getOutputValueSocket,
        executeSocketFunction,
        updateResults,
        addExecutionResult,
        setNodeExecuting,
        nodeFinished,
        setActiveNode 
    } = useContext(ExecutionContextData) as IExecutionEngineContext

    interface IUnloadProcessBody {
        processId: string
    }

    interface ILoadProcessBody {
        organizationId: string,
        quantaId: string
    }

    async function execute_node_server() {
        let token = authData?.token
        if(callStack === undefined || token === undefined)
            return
        if(quantaId === null || organizationId === null)
            return

        //grab all the input nodes
        let preloadedInputs = [] as IInternalStorePreload[]
        try {
            for(let i = 0; i < callStack.length; i++) {
                let stack = callStack[i]
                if(stack.functionId === "file_upload") {
                    let file_upload_val = await input_file_upload(stack)
                    let parsed_file_upload: IFileUploadOutput = JSON.parse(file_upload_val)
                    let parsed_file_keys = Object.keys(parsed_file_upload)

                    for(let x = 0; x < parsed_file_keys.length; x++) {
                        let parsed_key = parsed_file_keys[x]
                        if(parsed_key === "pError")
                            continue

                        let parsedVal = parsed_file_upload[parsed_key]
                        if(typeof parsedVal !== 'string')
                            continue

                        let store: IInternalStore = { nodeId: stack.nodeId, socketId: parsed_key }
                        preloadedInputs.push({
                            store: store,
                            value: parsedVal
                        })
                    }
                }
            }
        } catch (error) {
            return
        }

        let preloadStr = JSON.stringify(preloadedInputs)
        let preloadToken = await UploadProjectData(token, preloadStr)
        if(preloadToken === undefined)
            return

        let schema = getSchema("dataset")
        const functionId = "execute_stack"
        const nodeId = quantaId
        const outputIds = [] as string[]
        
        const body: IExecuteStackBody = {
            preloadedData: preloadToken,
            stack: callStack,
            edges: edges,
            organizationId: organizationId,
            schema: schema
        }

        await CreateExecutionCache(token, organizationId, quantaId, processId)
        let result = await executeFunction(nodeId, functionId, outputIds, body)
        if(result !== 'background') {
            //handle error
            showNotification({
                title: "Quanta Editor",
                message: `Error with executing graph -> ${result}`,
                color: 'red',
                autoClose: 1000 * 5
            })
        }
    }

    async function execute_nodes(isCache?: boolean) {
        let token = authData?.token
        if(callStack === undefined || token === undefined)
            return
        if(quantaId === null || organizationId === null)
            return

        const functionId = "load_process_id"
        const outputIds = [] as string[]
        const functionData: ILoadProcessBody = {
            organizationId: organizationId,
            quantaId: quantaId
        }

        await CreateExecutionCache(token, organizationId, quantaId, processId)
        let res = await executeFunction(v4(), functionId, outputIds, functionData)

        let cacheExecute = false
        if(isCache === true)
            cacheExecute = true

        for(let i = 0; i < callStack.length; i++) {
            let stack = callStack[i]
            await executeNode(stack, cacheExecute)
        }

        showNotification({
            title: "Quanta Editor",
            message: `Finished Executing Node Graph`,
            color: 'green',
            autoClose: 1000 * 5
        })

        await unload_process()
    }

    async function unload_process() {
        const functionId = "unload_process_id"
        const outputIds = [] as string[]
        const functionData: IUnloadProcessBody = {
            processId: processId
        }

        let res = await executeFunction(v4(), functionId, outputIds, functionData)

        //delete the cache form the server
        let token = authData?.token
        if(token === undefined)
            return
        if(quantaId === null || organizationId === null)
            return

        await DeleteExecutionCache(token, organizationId, quantaId, processId)
        setProcessId(v4())
        toggleUpdateEditorIndicators()
    }

    useEffect(() => {
        if(execute === undefined)
            return
        if(socketCreated !== true)
            return

        setExecutedNodes([])
        setFailedNodes([])

        execute_node_server()
    }, [execute])

    useEffect(() => {
        if(socketCreated !== true)
            return
        
        setExecutedNodes([])
        setFailedNodes([])
        
        execute_nodes(true)
    }, [executeCache])

    function addExecutedNode(id: string) {
        let nExecutedNodes = executedNodes
        nExecutedNodes.push(id)

        setExecutedNodes([ ...nExecutedNodes ])
    }

    function addFailedNode(nodeId: string) {
        let nFailedNodes = failedNodes
        nFailedNodes.push(nodeId)

        setFailedNodes([ ...nFailedNodes ])
    }

    function findStack(nodeId: string, passedStack?: ICallStackFunc[]): ICallStackFunc | undefined {
        let stack = undefined
        if(callStack === undefined)
            return
        
        let internalStack = callStack
        if(passedStack !== undefined)
            internalStack = passedStack

        for(let i = 0; i < internalStack.length; i++) {
            let stack_ = internalStack[i]
            if(stack_.nodeId === nodeId)
                return stack_

            let stackChildren = stack_.stackThread
            if(stackChildren !== undefined)
                stack = findStack(nodeId, stackChildren)
        }

        return stack
    }

    function setOutputValue(nodeId: string, socketId: string, val: any) {
        let promise = new Promise((resolve, reject) => {
            function handler(val: string) {
                resolve(true)
            }
            
            setOutputValueSocket(processId, nodeId, socketId, val, handler)
        })

        return promise
    }

    function getInputEdge(nodeId: string, socketId: string) : IQuantaRFEdge | undefined {
        let edge: IQuantaRFEdge | undefined = undefined
        for(let i = 0; i < edges.length; i++) {
            let edge_ = edges[i]
            if(edge_.target === nodeId && edge_.targetHandle === socketId)
                edge = edge_
        }

        return edge
    }

    function getInputValue(nodeId: string, socketId: string) {
        let edge: IQuantaRFEdge | undefined = getInputEdge(nodeId, socketId)

        let promise = new Promise((resolve, reject) => {
            if(edge === undefined) {
                resolve(undefined)
                return
            }

            if(edge.source === undefined || edge.sourceHandle === undefined) {
                resolve(undefined)
                return
            }

            function handler(val: string) {
                let data: IInputValueResp = JSON.parse(val)
                resolve(data.value)
            }

            getOutputValueSocket(processId, edge.source!, edge.sourceHandle!, handler)
        })

        return promise
    }

    function executeFunction(nodeId: string, functionId: string, outputIds: string[], functionData: any) {
        let promise = new Promise<string>((resolve, reject) => {
            function handler(val: string) {
                resolve(val)
            }

            executeSocketFunction(processId, nodeId, functionId, outputIds, functionData, handler)
        })

        return promise
    }

    async function executeNode(
        stack: ICallStackFunc, 
        isCache: boolean,
        index?: number, 
        loop_id?: string,
        _executedNodes?: string[], 
        _failedNodes?: string[],
        _addExecutedNode?: (val: string) => void,
        _addFailedNode?: (val: string) => void
    ) {
        let executionId = `${stack.functionId}:${stack.nodeId}`
        let dependencies = stack.dependencies

        let internalExecutedNodes = executedNodes
        let internalFailedNodes = failedNodes
        let internalAddExecutedNode = addExecutedNode
        let internalAddFailedNode = addFailedNode

        if(_executedNodes !== undefined)
            internalExecutedNodes = _executedNodes
        if(_failedNodes !== undefined)
            internalFailedNodes = _failedNodes
        if(_addExecutedNode !== undefined)
            internalAddExecutedNode = _addExecutedNode
        if(_addFailedNode !== undefined)
            internalAddFailedNode = _addFailedNode

        if(internalExecutedNodes.includes(executionId))
            return

        function isFailedNode(nodeId: string) {
            let failedNode = false
            for(let i = 0; i < internalFailedNodes.length; i++) {
                let failedId = internalFailedNodes[i]
                if(failedId === nodeId)
                    failedNode = true
            }
    
            return failedNode
        }

        for(let i = 0; i < dependencies.length; i++) {
            let dependency = dependencies[i]
            let dependentStack = findStack(dependency)
            if(dependentStack === undefined)
                continue

            await executeNode(dependentStack, isCache)
        }

        try {
            setNodeExecuting(stack.nodeId)
            setActiveNode(stack.nodeId)

            switch(stack.functionId) {
                case "start":
                    await startNode(stack, setOutputValue)
                    break
                case "file_upload":
                    let promise = await fileUploadNode(
                        stack, 
                        authData?.token,
                        isFailedNode, 
                        getInputEdge, 
                        getInputValue, 
                        executeFunction
                    )

                    await promise

                    break
                case "sdmx_data_parser":
                    await sdmxDataParserNode(stack, isFailedNode, getInputEdge, executeFunction)
                    break
                case "sdmx_data_mapper":
                    await sdmxDataMapper(stack, getInputEdge, executeFunction, isFailedNode, updateResults, addExecutionResult)
                    break
                case "loop":
                    await quantaLoop(stack, isCache, isFailedNode, executeFunction, executeNode, setActiveNode)
                    break
                case "iter":
                    await iterNode(stack, executeFunction, index, loop_id)
                    break
                case "get_sdmx_field_key":
                    await getSdmxFieldKey(stack, getInputEdge, isFailedNode, executeFunction)
                    break
                case "get_sdmx_field_value":
                    await getSdmxFieldValue(stack, getInputEdge, isFailedNode, executeFunction)
                    break
                case "string_to_date":
                    await stringToDate(stack, getInputEdge, isFailedNode, getInputValue, executeFunction)
                    break
                case "build_fields":
                    await buildFields(stack, getSchema, getInputEdge, isFailedNode, executeFunction)
                    break
                case "apply_data_rule":
                    await applyDataRule(stack, getInputEdge, isFailedNode, executeFunction)
                    break
                case "add_indicator":
                    await addIndicator(stack, getInputEdge, isFailedNode, executeFunction)
                    break
                case "update_indicator":
                    await updateIndicator(stack, getInputEdge, isFailedNode, executeFunction)
                    break
                default:
                    break
            }
        } catch (error) {
            console.debug(`error in ${stack.functionId} -> ${error}`)
            internalAddFailedNode(stack.nodeId)
            nodeFinished(stack.nodeId)
            setActiveNode("")
        }

        nodeFinished(stack.nodeId)
        setActiveNode("")
        internalAddExecutedNode(executionId)
    }

    return (
        <>
        
        </>
    )
}

export default CallstackWrapper