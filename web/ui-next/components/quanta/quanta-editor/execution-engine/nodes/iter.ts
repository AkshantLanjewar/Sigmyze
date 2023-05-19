import { ICallStackFunc } from "../types";
import { IInternalStore } from "./types";

interface IGetLoopIndexData {
    index: number,
    loopId: string,
    output: IInternalStore
}

async function iterNode(
    stack: ICallStackFunc,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>,
    index?: number,
    loop_id?: string
) {
    if(index === undefined)
        throw new Error("function requires index")
    if(loop_id === undefined)
        throw new Error("function requires a loop_id")

    let nodeId = stack.nodeId
    const functionId = "get_loop_index"
    const outputIds = [] as string[]
    const functionData: IGetLoopIndexData = {
        index,
        loopId: loop_id,
        output: {
            nodeId: nodeId,
            socketId: nodeId
        }
    }

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if(res !== "success")
        throw new Error("failed to grab index")
}

export default iterNode