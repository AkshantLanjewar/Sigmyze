import { createContext, useContext, useEffect, useRef, useState } from "react"
import { UserContextData } from "../../../../data/user/context"
import { IUserContext } from "../../../../data/user/types"
import { wsServer } from "../../../../data/utils"
import { IExecutionEngineContext } from "./types"

interface IExecutionContextProps {
    children?: React.ReactNode
}

const ExecutionContextData = createContext<IExecutionEngineContext | null>(null)

const ExecutionContext: React.FC<IExecutionContextProps> = ({ children }) => {
    const { loggedIn, loaded, authData } = useContext(UserContextData) as IUserContext
    const [socketCreated, setSocketCreated] = useState(false)
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        if(loaded === false)
            return
        if(loggedIn === false)
            return
        if(socketCreated === true)
            return
        
        const newWebsocket = new WebSocket(wsServer + "/quantaSocket")
        newWebsocket.onerror = err => console.error(err)
        newWebsocket.onmessage = msg => {
            console.log(msg)
        }
        newWebsocket.onopen = () => {
            setWebSocket(newWebsocket)
            setSocketCreated(true)
        }
    }, [])
    
    let contextData = {} as IExecutionEngineContext
    contextData.socketCreated = socketCreated

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