import { createContext, useContext, useEffect, useState } from "react"
import { ISocketHandlerState } from "./types"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { ISocketResp, ISocketRespHandler } from "../../quanta/quanta-editor/execution-engine/context/types"
import { wsServer } from "../../data/utils"
import { executeSocketFunction, getOutputValueSocket, setOutputValueSocket } from "../../quanta/quanta-editor/execution-engine/context/functions"

const SocketHandlerData = createContext<ISocketHandlerState | null>(null)

interface ISocketHandler {
    children?: React.ReactNode
}

const SocketHandler: React.FC<ISocketHandler> = ({ children }) => {
    const { loggedIn, loaded } = useContext(UserContextData) as IUserContext

    /**
     * state relating to sockets
     */
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

    function connect() {
        if(loaded === false || loggedIn === false)
            return
        if(socketCreated === true)
            return

        const newWebsocket = new WebSocket(wsServer + '/')

        newWebsocket.onerror = err => console.error(err)
        newWebsocket.onmessage = msg => {
            let msgData = msg.data
            let parsed: ISocketResp = JSON.parse(msgData)
            addMessage(parsed)
        }

        newWebsocket.onopen = () => {
            setWebSocket(newWebsocket)
            setSocketCreated(true)
        }

        newWebsocket.onclose = () => {
            setWebSocket(null)
            setSocketCreated(false)

            //call the connect function again
            connect()
        }
    }

    useEffect(() => {
        connect()
    }, [])

    useEffect(() => {
        connect() // persists connection
    }, [loaded, loggedIn, socketCreated])

    useEffect(() => {
        return () => {
            if(webSocket === null)
                return

            webSocket.close()
            setSocketCreated(false)
        }
    }, [webSocket])

    //handles the inbound messaging
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

    let contextData = {} as ISocketHandlerState
    
    //vars
    contextData.socketCreated = socketCreated
    contextData.socketResponseQueue = socketResponseQueue
    contextData.socketResponse = socketResponse

    //funcs
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

    return (
        <>
            <SocketHandlerData.Provider value={contextData}>
                <div style={{ width: '100%', height: '100%' }}>
                    {children}
                </div>
            </SocketHandlerData.Provider>
        </>
    )
}

export { SocketHandlerData }
export default SocketHandler