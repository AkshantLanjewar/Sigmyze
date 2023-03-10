interface ISocketMessage {
    /**
     * the function to be executed on the websocket server
     */
    socketFunc: string,

    /**
     * id created for the specific request
     */
    requestId: string,

    /**
     * the id for the callstack process
     */
    processId: string,

    /**
     * specific data for that request
     */
    socketData: any,
}

interface ISocketResp {
    /**
     * whether call had an error
     */
    error: boolean,

    /**
     * data returned by call
     */
    message: string,

    /**
     * the id for the request
     */
    requestId: string
}

export type { 
    ISocketMessage,
    ISocketResp 
}