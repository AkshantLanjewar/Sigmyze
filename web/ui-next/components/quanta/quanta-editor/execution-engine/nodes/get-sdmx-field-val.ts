import { IQuantaRFEdge } from "../../types/edges"
import { ICallStackFunc } from "../types"
import { IInternalStore } from "./types"

interface IGetSDMXFieldValParams {
    input: IInternalStore
}

async function getSdmxFieldValue(
    stack: ICallStackFunc,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    isFailedNode: (nodeId: string) => boolean,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>,
) {
    let nodeId = stack.nodeId
    let inputField = getInputEdge(nodeId, "sdmx_field")

    if(inputField === undefined)
        throw new Error("no connected edge")
    if(inputField.source === undefined || inputField.sourceHandle === undefined)
        throw new Error("malformed data")
    if(isFailedNode(inputField.source))
        throw new Error("input failed")

    const functionId = "get_sdmx_field_val"
    const outputIds = [] as string[]
    const functionData: IGetSDMXFieldValParams = {
        input: {
            nodeId: inputField.source,
            socketId: inputField.sourceHandle
        }
    }

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if (res !== "success")
        throw new Error(`Failed execution ${res}`)
}

export default getSdmxFieldValue