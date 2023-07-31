import { IQuantaRFEdge } from "../../types/edges";
import { ICallStackFunc } from "../types";
import { IInternalStore } from "./types";

interface IUpdateIndicatorParams {
    mode: string,
    fieldInput: IInternalStore,
    chartInput: IInternalStore
}

async function updateIndicator(
    stack: ICallStackFunc,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    isFailedNode: (nodeId: string) => boolean,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>,
) {
    let nodeId = stack.nodeId
    let chartEdge = getInputEdge(nodeId, "chart_data")
    let fieldEdge = getInputEdge(nodeId, "field")

    //we need to find the update mode
    let stackInputs = stack.inputs
    let updateMode: string | undefined = undefined
    for(let i = 0; i < stackInputs.length; i++) {
        let input = stackInputs[i]
        let inputType = input.type

        if(input.id === "mode")
            updateMode = inputType.typeId
    }

    if(updateMode === undefined)
        throw new Error("malformed update mode")
    if(chartEdge?.source === undefined || chartEdge?.sourceHandle === undefined)
        throw new Error("no connected chart")
    if(fieldEdge?.source === undefined || fieldEdge.sourceHandle === undefined)
        throw new Error("no connected field")

    //check if the connecting nodes failed or not
    if(isFailedNode(chartEdge.source))
        throw new Error("chart node failed")
    if(isFailedNode(fieldEdge.source))
        throw new Error("field node failed")

    let fieldSocket = {} as IInternalStore
    fieldSocket.nodeId = fieldEdge.source
    fieldSocket.socketId = fieldEdge.sourceHandle

    let chartSocket = {} as IInternalStore
    chartSocket.nodeId = chartEdge.source
    chartSocket.socketId = chartEdge.sourceHandle

    const functionId = "update_indicator"
    const outputIds = [] as string[]
    const functionData: IUpdateIndicatorParams = {
        mode: updateMode,
        fieldInput: fieldSocket,
        chartInput: chartSocket
    }

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if(res !== "success")
        throw new Error(`Failed to execute with error: ${res}`)
}

export default updateIndicator