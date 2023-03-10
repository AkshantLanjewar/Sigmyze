import { v4 } from "uuid"
import { ISocketMessage } from "../types"

interface ISetOutputValueSocketData {
    value: any,
    nodeId: string,
    socketId: string
}

function setOutputValueSocket(
    processId: string, 
    nodeId: string, 
    socketId: string, 
    value: any,
    webSocket: WebSocket | null
) {
    if(webSocket === null)
        return

    let message = {} as ISocketMessage
    message.socketFunc = "setOutputValue"
    message.requestId = v4()
    message.processId = processId

    let messageData = {} as ISetOutputValueSocketData
    messageData.nodeId = nodeId
    messageData.socketId = socketId
    messageData.value = value
    message.socketData = messageData

    let messageString = JSON.stringify(message)
    webSocket.send(messageString)
    return message.requestId
}



export { setOutputValueSocket }