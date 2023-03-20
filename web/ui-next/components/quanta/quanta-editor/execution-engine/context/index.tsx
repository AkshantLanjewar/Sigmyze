import { createContext, useContext, useEffect, useRef, useState } from "react"
import { UserContextData } from "../../../../data/user/context"
import { IUserContext } from "../../../../data/user/types"
import { wsServer } from "../../../../data/utils"
import { executeSocketFunction, getOutputValueSocket, setOutputValueSocket } from "./functions"
import { IExecutionEngineContext, ISocketResp, ISocketRespHandler } from "./types"

interface IExecutionContextProps {
    children?: React.ReactNode
}

const ExecutionContextData = createContext<IExecutionEngineContext | null>(null)

const ExecutionContext: React.FC<IExecutionContextProps> = ({ children }) => {
    const { loggedIn, loaded, authData } = useContext(UserContextData) as IUserContext

    const [socketCreated, setSocketCreated] = useState(false)
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
    const [socketResponseQueue, setSocketResponseQueue] = useState<ISocketResp[]>([])
    const [socketResponse, setSocketResponse] = useState(false)
    const [socketHandlers, setSocketHandlers] = useState<ISocketRespHandler[]>([])

    function addMessage(msg: ISocketResp) {
        let nSocketQueue = socketResponseQueue
        nSocketQueue.push(msg)

        setSocketResponseQueue([ ...nSocketQueue ])
        setSocketResponse(!socketResponse)
    }

    function addHandler(requestId: string, callback: Function) {
        let handler = {
            requestId,
            callback
        } as ISocketRespHandler

        let nHandlers = socketHandlers
        nHandlers.push(handler)
        setSocketHandlers([ ...nHandlers ])
    }

    useEffect(() => {
        if(loaded === false)
            return
        /*if(loggedIn === false)
            return */
        if(socketCreated === true)
            return
        
        const newWebsocket = new WebSocket(wsServer + "/")
        newWebsocket.onerror = err => console.error(err)
        newWebsocket.onmessage = msg => {
            let msgData = msg.data
            let parsed: ISocketResp = JSON.parse(msgData)

            console.debug(`[Lunar Socket]: Received msg with id ${parsed.requestId}`)
            addMessage(parsed)
        }

        newWebsocket.onopen = () => {
            setWebSocket(newWebsocket)
            setSocketCreated(true)
        }
    }, [])

    useEffect(() => {
        return () => {
            if(webSocket === null)
                return

            webSocket.close()
        }
    }, [webSocket])

    useEffect(() => {
        let collectedResponses = []
        for(let i = 0; i < socketResponseQueue.length; i++) {
            let response = socketResponseQueue[i]
            collectedResponses.push(response.requestId)
        }

        //go thru the handlers
        let nHandlers = []
        for(let i = 0; i < socketHandlers.length; i++) {
            let handler = socketHandlers[i]
            if(collectedResponses.includes(handler.requestId))
            {
                let index = collectedResponses.indexOf(handler.requestId)
                let response = socketResponseQueue[index]

                handler.callback(response.message)
                continue
            }

            nHandlers.push(handler)
        }

        setSocketHandlers([ ...nHandlers ])
    }, [socketResponseQueue])
    
    let contextData = {} as IExecutionEngineContext
    contextData.socketCreated = socketCreated
    contextData.socketResponseQueue = socketResponseQueue
    contextData.socketResponse = socketResponse

    contextData.setOutputValueSocket = (processId: string, nodeId: string, socketId: string, value: any, cb: Function) =>
        setOutputValueSocket(processId, nodeId, socketId, value, cb, webSocket, addHandler)
    contextData.getOutputValueSocket = (processId: string, nodeId: string, socketId: string, cb: Function) =>
        getOutputValueSocket(processId, nodeId, socketId, cb, webSocket, addHandler)
    contextData.executeSocketFunction = (
        processId: string, 
        nodeId: string, 
        functionId: string, 
        outputIds: string[], 
        functionData: any, 
        cb: Function
    ) => executeSocketFunction(processId, nodeId, functionId, outputIds, functionData, cb, webSocket, addHandler)

    contextData.deleteSocketMessage = (requestId: string) => {
        let nMessages = []
        for(let i = 0; i < socketResponseQueue.length; i++) {
            let message = socketResponseQueue[i]
            if(message.requestId === requestId)
                continue

            nMessages.push(message)
        }

        setSocketResponseQueue([ ...nMessages ])
    }

    return (
        <>
            <ExecutionContextData.Provider value={contextData}>
                <div style={{ width: '100%', height: '100%' }}>
                    {children}
                </div>
            </ExecutionContextData.Provider>
        </>
    )
}

export { ExecutionContextData }
export default ExecutionContext