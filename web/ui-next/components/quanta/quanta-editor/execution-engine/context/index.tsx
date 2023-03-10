import { createContext, useContext, useEffect, useRef, useState } from "react"
import { UserContextData } from "../../../../data/user/context"
import { IUserContext } from "../../../../data/user/types"
import { wsServer } from "../../../../data/utils"
import { setOutputValueSocket } from "./functions"
import { IExecutionEngineContext, ISocketResp } from "./types"

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

    function addMessage(msg: ISocketResp) {
        let nSocketQueue = socketResponseQueue
        nSocketQueue.push(msg)

        setSocketResponseQueue([ ...nSocketQueue ])
        setSocketResponse(!socketResponse)
    }

    useEffect(() => {
        if(loaded === false)
            return
        if(loggedIn === false)
            return
        if(socketCreated === true)
            return
        
        const newWebsocket = new WebSocket(wsServer + "/")
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
    }, [])

    useEffect(() => {
        return () => {
            if(webSocket === null)
                return

            webSocket.close()
        }
    }, [webSocket])
    
    let contextData = {} as IExecutionEngineContext
    contextData.socketCreated = socketCreated
    contextData.socketResponseQueue = socketResponseQueue
    contextData.socketResponse = socketResponse

    contextData.setOutputValueSocket = (processId: string, nodeId: string, socketId: string, value: any) =>
        setOutputValueSocket(processId, nodeId, socketId, value, webSocket)

    contextData.deleteSocketMessage = (requestId: string) => {
        let nMessages = []
        for(let i = 0; i < socketResponseQueue.length; i++) {
            let message = socketResponseQueue[i]
            if(message.requestId === requestId)
                continue

            nMessages.push(message)
        }

        console.debug(`computed message ${requestId}`)
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