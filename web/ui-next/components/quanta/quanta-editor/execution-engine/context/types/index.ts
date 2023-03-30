import { IQuantaSocket } from '../../../types/types'
import { INodeExecutionResult } from './node_data'
import { ISocketResp } from './socket'

interface IExecutionEngineContext {
    /**
     * whether or not a connection has been established to the server
     */
    socketCreated: boolean,

    /**
     * messages that have been received
     */
    socketResponseQueue: ISocketResp[],

    /**
     * hook when message is received
     */
    socketResponse: boolean,

    /**
     * execution result data
     */
    executionResults: INodeExecutionResult[],

    setOutputValueSocket: (
        processId: string, 
        nodeId: string, 
        socketId: string, 
        value: any, 
        cb: (val: string) => void
    ) => string | undefined,

    getOutputValueSocket: (
        processId: string, 
        nodeId: string, 
        socketId: string, 
        cb: (val: string) => void
    ) => string | undefined,

    executeSocketFunction: (
        processId: string, 
        nodeId: string, 
        functionId: string,
        outputIds: string[],
        functionData: any,
        cb: (val: string) => void
    ) => string | undefined,

    deleteSocketMessage: (requestId: string) => void,

    //functions relating to dynamic execution data
    updateResults: (nodeId: string, fieldId: string, data: string) => boolean,
    addExecutionResult: (nodeId: string, fieldId: string, data: string, sockets: IQuantaSocket[]) => void
}

export type { IExecutionEngineContext }
export * from './socket'
export * from './node_data'