import { v4 } from "uuid";
import { IQuantaRFEdge } from "../types/types";
import { ISocketResp } from "./context/types";
import fileUploadExecute from "./functions/file-upload";
import Observable from "./functions/observable";
import sdmxDataParserExecute from "./functions/sdmx-data-parser";
import startExecute from "./functions/start";
import { ICallStackFunc, ICallStackParam, ICallStackStore } from "./types";

class StackEngine {
    private callstack: ICallStackFunc[]
    private executedNodes: string[]
    private callstackStore: ICallStackStore
    private edges: IQuantaRFEdge[]
    private executionId: string
    private socketResponseQueue: Observable

    //passed functions
    private setOutputValueSocket: (processId: string, nodeId: string, socketId: string, value: any) => string | undefined
    private deleteSocketMessage: (requestId: string) => void

    constructor(
        _callstack: ICallStackFunc[], 
        _edges: IQuantaRFEdge[],
        _setOutputValueSocket: (processId: string, nodeId: string, socketId: string, value: any) => string | undefined,
        _deleteSocketMessage: (requestId: string) => void
    ) {
        this.callstack = _callstack
        this.executedNodes = []
        this.callstackStore = {}
        this.edges = _edges
        this.executionId = v4()
        this.socketResponseQueue = new Observable([])

        this.setOutputValueSocket = _setOutputValueSocket
        this.deleteSocketMessage = _deleteSocketMessage
    }

    updateMessages(socketResponseQueue: ISocketResp[]) {
        this.socketResponseQueue.setValue([ ...socketResponseQueue ])
    }

    async execute() {
        for(let i = 0; i < this.callstack.length; i++) {
            let stack = this.callstack[i]
            await this.executeNode(stack)
        }
    }

    private logMsg(msg: string) {
        console.log(`[EXECUTION_ENGINE]: ${msg}`)
    }

    private findStack(nodeId: string) {
        let stack = undefined
        for(let i = 0; i < this.callstack.length; i++) {
            let stack_ = this.callstack[i]
            if(stack_.nodeId === nodeId)
                stack = stack_
        }

        return stack
    }

    getInputValue(nodeId: string, socketId: string) {
        if(this === undefined)
            return

        let edge = undefined
        for(let i = 0; i < this.edges.length; i++) {
            let edge_ = this.edges[i]
            if(edge_.target === nodeId && edge_.targetHandle === socketId)
                edge = edge_
        }

        if(edge === undefined)
            return

        let inputQuery = `${edge.source}:${edge.sourceHandle}`
        return this.callstackStore[inputQuery]
    }

    setOutputValue(nodeId: string, socketId: string, val: any) {
        if(this === undefined)
            return

        let query = `${nodeId}:${socketId}`
        this.callstackStore[query] = val
    }

    setOutputValueAsync(nodeId: string, socketId: string, val: any) : Promise<boolean> {
        let that = this
        let promise = new Promise<boolean>(function(resolve, reject) {
            let requestId = that.setOutputValueSocket(that.executionId, nodeId, socketId, val)
            if(requestId === undefined)
                resolve(false)

            that.socketResponseQueue.onChange(() => {
                let messages = that.socketResponseQueue.getValue() as ISocketResp[]
                let message = undefined
                for(let i = 0; i < messages.length; i++) {
                    let _message = messages[i]
                    if(_message.requestId === requestId)
                        message = _message
                }

                if(message === undefined)
                    return
                if(requestId === undefined)
                    return

                that.deleteSocketMessage(requestId)
                resolve(true)
            })
        })

        return promise
    }

    private async executeNode(stack: ICallStackFunc) {
        let executionId = `${stack.functionId}:${stack.nodeId}`
        let dependencies = stack.dependencies
        if(this.executedNodes.includes(executionId))
            return
        
        for(let i = 0; i < dependencies.length; i++) {
            let dependency = dependencies[i]
            let dependentStack = this.findStack(dependency)
            if(dependentStack === undefined)
                continue

            await this.executeNode(dependentStack)
        }

        try {
            switch(stack.functionId) {
                case "start":
                    await startExecute.call(this, stack)
                    break
                case "file_upload":
                    await fileUploadExecute.call(this, stack)
                    break
                case "sdmx_data_parser":
                    await sdmxDataParserExecute.call(this, stack)
                    break
                default:
                    break
            }
        } catch (error) {
            this.logMsg(`error -> ${error}`)
        }

        //node has been executed
        this.executedNodes.push(executionId)
    }
}

export default StackEngine