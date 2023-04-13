import { ISocketResp } from "../../quanta/quanta-editor/execution-engine/context/types";

interface ISocketHandlerState {
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

    //funcs
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
}

export type { ISocketHandlerState }