import { IQuantaRFEdge } from "../types/types";
import fileUploadExecute from "./functions/file-upload";
import sdmxDataParserExecute from "./functions/sdmx-data-parser";
import startExecute from "./functions/start";
import { ICallStackFunc, ICallStackParam, ICallStackStore } from "./types";

class StackEngine {
    private callstack: ICallStackFunc[]
    private executedNodes: string[]
    private callstackStore: ICallStackStore
    private edges: IQuantaRFEdge[]

    constructor(_callstack: ICallStackFunc[], _edges: IQuantaRFEdge[]) {
        this.callstack = _callstack
        this.executedNodes = []
        this.callstackStore = {}
        this.edges = _edges
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