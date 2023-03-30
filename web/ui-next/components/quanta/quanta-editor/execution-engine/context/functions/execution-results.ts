import { Dispatch, SetStateAction } from "react";
import { IQuantaSocket } from "../../../types/node-instructions";
import { INodeExecutionResult } from "../types";

function updateResults(
    nodeId: string, 
    fieldId: string, 
    data: string,
    executionResults: INodeExecutionResult[]
) {
    let executionField = undefined
    for(let i = 0; i < executionResults.length; i++) {
        let executionResult = executionResults[i]
        if(executionResult.nodeId === nodeId && executionResult.fieldId === fieldId)
            executionField = executionResult
    }

    if(executionField === undefined)
        return true

    let rawData = executionField.rawData
    if(rawData === data)
        return false

    return true
} 

function addExecutionResults(
    nodeId: string, 
    fieldId: string, 
    data: string,
    sockets: IQuantaSocket[],
    executionResults: INodeExecutionResult[],
    setExecutionResults: Dispatch<SetStateAction<INodeExecutionResult[]>>
) {
    let executionResult = {} as INodeExecutionResult
    executionResult.nodeId = nodeId
    executionResult.fieldId = fieldId
    executionResult.rawData = data
    executionResult.computedSockets = sockets

    let nResults = [ ...executionResults, executionResult ]
    setExecutionResults([ ...nResults ])
}

export { 
    updateResults,
    addExecutionResults 
}