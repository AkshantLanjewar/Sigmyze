import { IQuantaSocket } from "../../../types/node-instructions"

interface INodeExecutionResult {
    /**
     * this is the node id for the node we created dynamic outputs
     */
    nodeId: string,

    /**
     * this is the id for the dynamic field we are creating
     */
    fieldId: string,

    /**
     * this is the raw data from the request, so we can avoid over updating
     */
    rawData: string,

    /**
     * theese are the dynamic sockets computed from the output
     */
    computedSockets: IQuantaSocket[]
}

export type { INodeExecutionResult }