import { IQuantaRFEdge } from "../../types/types";
import { ICallStackFunc } from "../types";
import { IInternalStore } from "./types";

interface IApplyDataRuleParams {
    dataRule: string,
    chartSocket: IInternalStore,
    dateSocket?: IInternalStore
}

async function applyDataRule(
    stack: ICallStackFunc,
    getInputEdge: (nodeId: string, socketId: string) => IQuantaRFEdge | undefined,
    isFailedNode: (nodeId: string) => boolean,
    executeFunction: (nodeId: string, functionId: string, outputIds: string[], functionData: any) => Promise<string>
) {
    let stackInputs = stack.inputs
    let selected_rule: string | undefined = undefined
    for(let i = 0; i < stackInputs.length; i++) {
        let input = stackInputs[i]
        let inputType = input.type

        if(input.id === "rule")
            selected_rule = inputType.typeId
    }

    if(selected_rule === undefined)
        throw new Error("no rule selected")

    let nodeId = stack.nodeId
    let chartEdge = getInputEdge(nodeId, "chart_data")
    let chartEdgeId = chartEdge?.source
    let chartSocketId = chartEdge?.sourceHandle

    if(chartEdgeId === undefined || chartSocketId === undefined)
        throw new Error("malformed data")
    if(isFailedNode(chartEdgeId))
        throw new Error("chart data failed")

    const chartSocket: IInternalStore = {
        nodeId: chartEdgeId,
        socketId: chartSocketId
    }

    const functionData: IApplyDataRuleParams = { dataRule: selected_rule, chartSocket }
    switch(selected_rule) {
        case "is_projection":
            let dateEdge = getInputEdge(nodeId, "last_date")    
            let dateEdgeId = dateEdge?.source
            let dateSocketId = dateEdge?.sourceHandle

            if(dateEdgeId === undefined || dateSocketId === undefined)
                throw new Error("malformed data")
            if(isFailedNode(dateEdgeId))
                throw new Error("chart date failed")

            let dateSocket = {} as IInternalStore
            dateSocket.nodeId = dateEdgeId
            dateSocket.socketId = dateSocketId

            functionData.dateSocket = dateSocket
            break
        default:
            throw new Error("Valid rule not selected")
    }

    const functionId = "apply_data_rule"
    const outputIds = [] as string[]

    let res = await executeFunction(nodeId, functionId, outputIds, functionData)
    if(res !== "success")
        throw new Error(`Node error: ${res}`)
}

export default applyDataRule