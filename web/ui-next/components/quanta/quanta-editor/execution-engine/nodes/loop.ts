import { v4 } from "uuid";
import { ICallStackFunc } from "../types";
import { IInternalStore } from "./types";
import { Dispatch, SetStateAction } from "react";

interface ILoadLoopData {
    loopId: string,
    connected: IInternalStore
}

interface IUnloadLoopData {
    loopId: string
}

interface ILoadLoopResponse {
    loopLength: number
}

async function quantaLoop(
    stack: ICallStackFunc,
    isCache: boolean,
    isFailedNode: (nodeId: string) => boolean,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>,
    executeNode: (
        stack: ICallStackFunc, 
        isCache: boolean,
        index?: number, 
        loop_id?: string,
        _executedNodes?: string[], 
        _failedNodes?: string[],
        _addExecutedNode?: (val: string) => void,
        _addFailedNode?: (val: string) => void
    ) => Promise<any>,
    setActiveNode: Dispatch<SetStateAction<string>>
) {
    let connectedNode = stack.inputs[0].id
    let connectedSocket = stack.inputs[0].name

    if(isFailedNode(connectedNode))
        throw new Error("inputs failed")

    let loopId = v4()
    const functionId = "load_loop"
    const outputIds = [] as string[]
    const functionData: ILoadLoopData = {
        loopId: loopId,
        connected: {
            nodeId: connectedNode,
            socketId: connectedSocket
        }
    }

    let res = await executeFunction(stack.nodeId, functionId, outputIds, functionData)
    let res_parsed: ILoadLoopResponse = JSON.parse(res)
    let length = res_parsed.loopLength

    let index = 0
    const childThread = stack.stackThread
    if(childThread === undefined)
        throw new Error("no thread provided")

    const findThread = (id: string) => {
        let thread = undefined
        for(let i = 0; i < childThread.length; i++) {
            let _thread = childThread[i]
            if(_thread.nodeId === id)
                thread = _thread
        }

        return thread
    }

    let executedNodes = [] as string[]
    let failedNodes = [] as string[]

    function addExecutedNode(val: string) {
        executedNodes.push(val)
    }

    function addFailedNode(val: string) {
        failedNodes.push(val)
    }

    if(isCache === true)
        length = 1

    while(index < length) {
        executedNodes = []
        failedNodes = []

        try {
            for(let i = 0; i < childThread.length; i++) {
                let thread = childThread[i]

                //executes sub dependencies
                let dependencies = thread.dependencies
                for(let i = 0; i < dependencies.length; i++) {
                    let dependency = dependencies[i]
                    let thread = findThread(dependency)
                    if(thread === undefined)
                        continue

                    setActiveNode(thread.nodeId)
                    await executeNode(thread, isCache, index, loopId, executedNodes, failedNodes, addExecutedNode, addFailedNode)
                    setActiveNode("")
                }

                setActiveNode(thread.nodeId)
                await executeNode(thread, isCache, index, loopId, executedNodes, failedNodes, addExecutedNode, addFailedNode)
                setActiveNode("")
            }
        } catch (error) {
            console.debug(`Received error -> ${error}`)
        }

        index += 1
    }

    const unloadFunctionId = "unload_loop"
    const unloadFunctionData: IUnloadLoopData = {
        loopId
    }

    let unloadRes = await executeFunction(stack.nodeId, unloadFunctionId, outputIds, unloadFunctionData)
    if(unloadRes !== "removed")
        throw new Error(`failed to unload array from memory -> ${unloadRes}`)

    console.debug(`Finished executing loop with length: ${length}`)
}

export default quantaLoop