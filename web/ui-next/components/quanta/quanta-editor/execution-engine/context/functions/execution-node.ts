import { Dispatch, SetStateAction } from "react"

const setNodeExecuting = (
    nodeId: string,
    activeNodes: string[],
    setActiveNodes: Dispatch<SetStateAction<string[]>>
) => {
    let node = undefined
    for(let i = 0; i < activeNodes.length; i++) {
        let activeNode = activeNodes[i]
        if(activeNode === nodeId)
            node = nodeId
    }

    if(node !== undefined)
        return

    let nActiveNodes = activeNodes
    nActiveNodes.push(nodeId)
    setActiveNodes([ ...nActiveNodes ])
}

const nodeFinished = (
    nodeId: string,
    activeNodes: string[],
    setActiveNodes: Dispatch<SetStateAction<string[]>>
) => {
    let newNodes = [] as string[]
    for(let i = 0; i < activeNodes.length; i++) {
        let activeNode = activeNodes[i]
        if(activeNode === nodeId)
            continue

        newNodes.push(activeNode)
    }

    setActiveNodes(newNodes)
}

const isExecuting = (
    nodeId: string,
    activeNodes: string[]
) => {
    for(let i = 0; i < activeNodes.length; i++) {
        let node = activeNodes[i]
        if(node === nodeId)
            return true
    }
    
    return false
}

export { 
    setNodeExecuting,
    nodeFinished,
    isExecuting 
}