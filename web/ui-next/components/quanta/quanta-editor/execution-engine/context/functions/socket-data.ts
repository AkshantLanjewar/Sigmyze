import { v4 } from "uuid"
import { ISocketMessage } from "../types"
import { showNotification } from "@mantine/notifications"

//util to get the size of the message in bytes, if its too big, tell user to switch to chromuim browser (firefox is ass)
const byteSize = (str: string) => new Blob([str]).size

const errorMessage = () => {
    let msg = "Unfortunately, Your message is too big to handle in Firefox, "
    msg += "please switch to a chromium based browser instead"

    showNotification({
        title: "Quanta Editor",
        message: msg,
        color: 'red',
        autoClose: 1000 * 5
    })
}

const isFirefox = () => navigator.userAgent.indexOf("Firefox") > 0

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
    if(byteSize(messageString) > 16777200 && isFirefox()) {
        errorMessage()
        return
    }

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
    if(byteSize(messageString) > 16777200 && isFirefox()) {
        errorMessage()
        return
    }

    webSocket.send(messageString)
    addHandler(message.requestId, callback)
    return message.requestId
}

interface IExecuteFunctionData {
    nodeId: string,
    functionId: string,
    outputIds: string[],
    functionData: any
}

function executeSocketFunction(
    processId: string,
    nodeId: string,
    functionId: string,
    outputIds: string[],
    functionData: any,
    callback: Function,
    webSocket: WebSocket | null,
    addHandler: (requestId: string, callback: Function) => void
) {
    if(webSocket === null)
        return

    let message = {} as ISocketMessage
    message.socketFunc = "execute_function"
    message.requestId = v4()
    message.processId = processId

    let messageData = {} as IExecuteFunctionData
    messageData.nodeId = nodeId
    messageData.functionId = functionId
    messageData.functionData = functionData
    messageData.outputIds = outputIds
    
    message.socketData = messageData
    let messageString = JSON.stringify(message)
    if(byteSize(messageString) > 16777200 && isFirefox()) {
        errorMessage()
        return
    }

    webSocket.send(messageString)
    addHandler(message.requestId, callback)
    return message.requestId
}

export { 
    setOutputValueSocket,
    getOutputValueSocket,
    executeSocketFunction 
}