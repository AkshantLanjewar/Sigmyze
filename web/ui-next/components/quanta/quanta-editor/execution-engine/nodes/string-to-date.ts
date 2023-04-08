import { IQuantaRFEdge } from "../../types/types";
import { ICallStackFunc } from "../types";

interface IStringToDateParams {
    timestamp: number
}

async function stringToDate(
    stack: ICallStackFunc,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    isFailedNode: (nodeId: string) => boolean,
    getInputValue: (nodeId: string, socketId: string) => void,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>,
) {
    let nodeId = stack.nodeId
    let inputField = getInputEdge(nodeId, "in_string")

    if(inputField === undefined)
        throw new Error("no connected edge")
    if(inputField.source === undefined || inputField.sourceHandle === undefined)
        throw new Error("malformed data")
    if(isFailedNode(inputField.source))
        throw new Error("input failed")

    //retreive the field so we can do date parsing here bc date parsing in rust is ass
    let inputValue = await getInputValue(nodeId, "in_string") as any
    if(inputValue === undefined)
        throw new Error("failed to retreive input")

    let timestamp = Date.parse(inputValue)
    if(isNaN(timestamp))
        throw new Error("Invalid date format supplied")

    const functionId = "string_to_date"
    const outputIds = [] as string[]
    const functionData: IStringToDateParams = {
        timestamp: timestamp
    }

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if(res !== "converted")
        throw new Error(`Failed to convert to date err: ${res}`)
}

export default stringToDate