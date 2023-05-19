import { IconInputSearch, IconStack2 } from "@tabler/icons";
import { IQuantaRFEdge, IQuantaSocket } from "../../types/types";
import { ICallStackFunc } from "../types";
import { IInternalStore } from "./types";

interface ISDMXDataMapperFunction {
    input: IInternalStore
}

async function sdmxDataMapper(
    stack: ICallStackFunc,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>,
    isFailedNode: (nodeId: string) => boolean,
    updateResults: (nodeId: string, fieldId: string, data: string) => boolean,
    addExecutionResult: (nodeId: string, fieldId: string, data: string, sockets: IQuantaSocket[]) => void
) {
    let nodeId = stack.nodeId
    let connectedEdge = getInputEdge(nodeId, "sdmx_data")
    
    if(connectedEdge === undefined)
        throw new Error("no connected edge")
    if(connectedEdge.source === undefined || connectedEdge.sourceHandle === undefined)
        throw new Error("malformed data")
    if(isFailedNode(connectedEdge.source))
        throw new Error("inputs failed")

    const functionId = "sdmx_data_mapper"
    const outputIds = [] as string[]
    const functionData: ISDMXDataMapperFunction = {
        input: {
            nodeId: connectedEdge.source,
            socketId: connectedEdge.sourceHandle
        }
    }

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if(updateResults(nodeId, "sdmx_fields", res) === false)
        return

    //update the engine with the new state
    let sockets = [] as IQuantaSocket[]
    let sdmx_fields: string[] = JSON.parse(res)
    for(let i = 0; i < sdmx_fields.length; i++) {
        let sdmx_field = sdmx_fields[i]
        let socket = {} as IQuantaSocket

        socket.type = { groupId: "base", typeId: "sdmx_field" }
        socket.socketId = sdmx_field
        socket.socketName = sdmx_field
        socket.icon = <IconStack2 />
        sockets.push(socket)
    }

    addExecutionResult(nodeId, "sdmx_fields", res, sockets)
}

export default sdmxDataMapper