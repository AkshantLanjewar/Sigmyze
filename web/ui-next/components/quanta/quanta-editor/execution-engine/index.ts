import prebuildNodeDict from "../config/prebuilt_nodes";
import { GetConnectedEdge } from "../functions";
import { IQuantaRFEdge } from "../types/edges";
import { IQuantaRFNode } from "../types/nodes";
import { IQuantaSocket, IQuantaStore } from "../types/types";
import { buildStoreKey } from "../utils";
import StackEngine from "./callstack"
import { ICallStackFunc, ICallStackParam } from "./types";

function getDependentEdges(nodeId: string, edges: IQuantaRFEdge[]) {
    let connectedEdges = []
    for(let i = 0; i < edges.length; i++) {
        let edge = edges[i]
        if(edge.target === nodeId)
            connectedEdges.push(edge.source!)
    }

    return connectedEdges
}

function getNodeParams(node: IQuantaRFNode, quantaStore: IQuantaStore) {
    const instructions = Object.keys(prebuildNodeDict)
    let instructionId = node.data?.instructionId
    if(instructionId === undefined)
        return
    if(instructions.includes(instructionId) === false)
        return

    let nodeInstruction = prebuildNodeDict[instructionId]
    let nodeInputSockets = nodeInstruction.inputs
    let nodeOutputSockets = nodeInstruction.outputs
    if(nodeInputSockets === undefined || nodeOutputSockets === undefined)
        return

    let inputs = [] as ICallStackParam[]
    for(let i = 0; i < nodeInputSockets.length; i++) {
        let input = nodeInputSockets[i]
        if(input.dynamicSocket === true)
            continue
        if(input.socketId === undefined || input.type === undefined || input.socketName === undefined)
            continue

        inputs.push({
            id: input.socketId,
            type: input.type,
            name: input.socketName,
            staticSocket: input.staticSocket
        })
    }

    //handles the dynamic sockets
    for(let i = 0; i < nodeInputSockets.length; i++) {
        let input = nodeInputSockets[i]
        if(input.dynamicSocket !== true)
            continue

        let dependent = input.dynamicDepend
        if(dependent === "input_val") {
            let inputId = input.inputId
            let depdendentInputs = input.dependentInputs
            if(inputId === undefined || depdendentInputs === undefined)
                continue

            let socket = undefined
            for(let x = 0; x < inputs.length; x++) {
                let colInput = inputs[x]
                if(colInput.id === inputId)
                    socket = colInput
            }

            if(socket === undefined)
                continue
            let socketValue = socket.type.typeId
            if(socketValue === undefined)
                continue

            let dynamicSockets = [] as IQuantaSocket[]
            for(let x = 0; x < depdendentInputs.length; x++) {
                let depdendentInput = depdendentInputs[x]
                if(depdendentInput.inputValue === socketValue)
                    dynamicSockets = depdendentInput.sockets
            }

            for(let x = 0; x < dynamicSockets.length; x++) {
                let dynamicSocket = dynamicSockets[x]
                if(dynamicSocket.socketId === undefined || dynamicSocket.type === undefined || dynamicSocket.socketName === undefined)
                    continue
                
                inputs.push({
                    id: dynamicSocket.socketId,
                    type: dynamicSocket.type,
                    name: dynamicSocket.socketName
                })
            }
        }
    }

    let dynamicOutParams = [] as ICallStackParam[]
    for(let i = 0; i < nodeOutputSockets.length; i++) {
        let output = nodeOutputSockets[i]
        if(output.dynamicSocket !== true)
            continue

        let dynamicType = output.dynamicDepend
        if(dynamicType === "store") {
            let storeKey = output.storeKey
            if(storeKey === undefined)
                continue

            storeKey = buildStoreKey(node.id!, storeKey)
            let store = quantaStore[storeKey]
            if(store === undefined)
                continue

            let items = store.items
            if(items === undefined)
                continue

            for(let x = 0; x < items.length; x++) {
                let item = items[x]
                let itemId = item.id
                let itemType = item.data.type
                let itemName = item.data.name 

                if(itemId === undefined || itemType === undefined || itemName === undefined)
                    continue

                dynamicOutParams.push({
                    id: itemId,
                    type: itemType,
                    name: itemName
                })
            }
        }
    }

    return { inputs, dynamicOutputs: dynamicOutParams }
}

function ExecuteNodeGraph(nodes: IQuantaRFNode[], edges: IQuantaRFEdge[], quantaStore: IQuantaStore) {
    let unsortedNodes = [...nodes].reverse()
    let callStack = [] as ICallStackFunc[]
    for(let i = 0; i < unsortedNodes.length; i++) {
        let node = unsortedNodes[i]
        let dependentEdges = getDependentEdges(node.id!, edges)
        
        //figure out the inputs and outputs to the function
        let params = getNodeParams(node, quantaStore)
        if(params === undefined)
            continue

        let nodeId = node.id
        let functionId = node.data?.instructionId
        if(nodeId === undefined || functionId === undefined)
            continue

        callStack.push({
            nodeId,
            functionId,
            inputs: params.inputs,
            dynamicOutputs: params.dynamicOutputs,
            dependencies: dependentEdges
        })
    }

    let engine = new StackEngine(callStack, edges)
    engine.execute()
}

export default ExecuteNodeGraph