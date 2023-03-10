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

    setOutputValueSocket: (processId: string, nodeId: string, socketId: string, value: any) => string | undefined,
    deleteSocketMessage: (requestId: string) => void
}

export type { IExecutionEngineContext }
export * from './socket'