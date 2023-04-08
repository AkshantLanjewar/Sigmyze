import { IQuantaSchema } from "../../../schema-editor/types";
import { IQuantaSocket } from "../../types/node-instructions";
import { IQuantaTypeRef } from "../../types/node-type";
import { IQuantaRFEdge } from "../../types/types";
import { ICallStackFunc } from "../types";
import { IInternalStore } from "./types";

interface IQuantaFieldParam {
    socket: IInternalStore,
    fieldName: string,
    fieldType: IQuantaTypeRef
}

interface IBuildFieldsParam {
    fields: IQuantaFieldParam[]
}

async function buildFields(
    stack: ICallStackFunc,
    getSchema: (parentId: string) => IQuantaSchema | undefined,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    isFailedNode: (nodeId: string) => boolean,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>
) {
    let schema = getSchema("dataset")
    let schemaNodes = schema?.children
    if(schemaNodes === undefined)
        throw new Error("schema is not defined")

    let dynamicSockets = [] as IQuantaSocket[]
    for(let i = 0; i < schemaNodes.length; i++) {
        let schemaNode = schemaNodes[i]
        let phantomSocket = {} as IQuantaSocket

        phantomSocket.type = schemaNode.quantaType
        phantomSocket.socketId = schemaNode.nodeId
        phantomSocket.socketName = schemaNode.name
        dynamicSockets.push(phantomSocket)
    }

    //go through and verify the sockets
    let fieldParams = [] as IQuantaFieldParam[]
    let nodeId = stack.nodeId
    for(let i = 0; i < dynamicSockets.length; i++) {
        let dynamicSocket = dynamicSockets[i]
        let socketId = dynamicSocket.socketId
        if(socketId === undefined)
            continue
        if(dynamicSocket.socketName === undefined || dynamicSocket.type === undefined)
            continue

        let edge = getInputEdge(nodeId, socketId)
        if(edge === undefined)
            continue
        if(edge.source === undefined || edge.sourceHandle === undefined)
            continue

        let internalSocket = {} as IInternalStore
        internalSocket.nodeId = edge.source
        internalSocket.socketId = edge.sourceHandle

        let fieldParam = {} as IQuantaFieldParam
        fieldParam.socket = internalSocket
        fieldParam.fieldName = dynamicSocket.socketName
        fieldParam.fieldType = dynamicSocket.type
        fieldParams.push(fieldParam)
    }

    //error checking the params
    for(let i = 0; i < fieldParams.length; i++) {
        let fieldParam = fieldParams[i]
        let fieldNodeId = fieldParam.socket.nodeId
        if(isFailedNode(fieldNodeId))
            throw new Error("Inputs failed")
    }

    const functionId = "build_fields"
    const outputIds = [] as string[]
    const functionData: IBuildFieldsParam = {
        fields: fieldParams
    }

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if(res !== "success")
        throw new Error(`error in function: ${res}`)
}

export default buildFields