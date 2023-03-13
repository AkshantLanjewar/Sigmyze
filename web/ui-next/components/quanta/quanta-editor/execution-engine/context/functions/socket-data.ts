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
    callback: Function,
    webSocket: WebSocket | null,
    addHandler: (requestId: string, callback: Function) => void
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
    console.debug(`Sending MSG of size ${messageString.length}`)
    webSocket.send(messageString)

    addHandler(message.requestId, callback)
    return message.requestId
}

interface IGetOutputValueSocketData {
    nodeId: string,
    socketId: string
}

function getOutputValueSocket(
    processId: string,
    nodeId: string,
    socketId: string,
    callback: Function,
    webSocket: WebSocket | null,
    addHandler: (requestId: string, callback: Function) => void
) {
    if(webSocket === null)
        return

    let message = {} as ISocketMessage
    message.socketFunc = "getOutputValue"
    message.requestId = v4()
    message.processId = processId

    let messageData = {} as IGetOutputValueSocketData
    messageData.nodeId = nodeId
    messageData.socketId = socketId
    message.socketData = messageData

    let messageString = JSON.stringify(message)
    webSocket.send(messageString)

    addHandler(message.requestId, callback)
    return message.requestId
}

export { 
    setOutputValueSocket,
    getOutputValueSocket 
}