import { Dispatch, RefObject, SetStateAction } from "react"
import { ReactFlowInstance } from "reactflow"
import { IQuantaRFNode, IQuantaRFNodeDataType, IQuantaTypeRef, IQuantaXYPos } from "../types/types"
import { BuildNode } from "../utils"

function CreateMenuNode(
    parentId: string, 
    parentHandle: string, 
    childType: string, 
    handleRef: RefObject<HTMLElement>,
    nodes: IQuantaRFNode[],
    reactFlowInstance: ReactFlowInstance<any, any> | null,
    editorBounds: IQuantaXYPos,
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
    toggleFocus: () => void
) {
    if(handleRef.current === null)
        return
    if(reactFlowInstance === null)
        return

    let nNodes = nodes
    let newNode = BuildNode(childType)!
    let handleCoords = handleRef.current.getBoundingClientRect()

    const position = reactFlowInstance.project({
        x: handleCoords.x - editorBounds.x,
        y: handleCoords.y - editorBounds.y - 70
    })

    newNode.position = position
    nNodes.push(newNode)

    toggleFocus()
    setNodes([ ...nNodes ])
}

function trackNodeType(
    nodeId: string, 
    socketId: string, 
    type: IQuantaTypeRef,
    nodes: IQuantaRFNode[],
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
) {
    let node = null
    let index = null

    for(let i = 0; i < nodes.length; i++) {
        let node_ = nodes[i]
        if(node_.id === nodeId) {
            node = node_
            index = i
        }
    }

    if(node === null)
        return
    
    let nodeData = node.data!
    let trackedTypes = nodeData.types
    if(trackedTypes === undefined)
        trackedTypes = []

    //check if the tracked types already contains this type
    for(let i = 0; i < trackedTypes.length; i++) {
        let trackedType = trackedTypes[i]
        if(trackedType.socketId === socketId)
            return
    }

    let nTrack = {
        socketId: socketId,
        type: type
    } as IQuantaRFNodeDataType
    trackedTypes.push(nTrack)

    //set the data
    nodeData.types = trackedTypes
    node.data = nodeData
    
    let nNodes = nodes
    nNodes[index!] = node
    setNodes([ ...nNodes ]) 
}

function updateTrackedNodeType(
    nodeId: string, 
    socketId: string, 
    type: IQuantaTypeRef,
    nodes: IQuantaRFNode[],
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
) {
    let node = null
    let index = null

    for(let i = 0; i < nodes.length; i++) {
        let node_ = nodes[i]
        if(node_.id === nodeId) {
            node = node_
            index = i
        }
    }

    if(node === null)
        return
    let nodeData = node.data!
    let trackedTypes = nodeData.types
    if(trackedTypes === undefined)
        return

    let nTrackedTypes = []
    for(let i = 0; i < trackedTypes.length; i++) {
        let trackedType = trackedTypes[i]
        if(trackedType.socketId === socketId)
            trackedType.type = type

        nTrackedTypes.push(trackedType)
    }

    //set the data
    nodeData.types = trackedTypes
    node.data = nodeData
    
    let nNodes = nodes
    nNodes[index!] = node
    setNodes([ ...nNodes ]) 
}

function deleteNode(
    nodeId: string,
    setStoreModal: Dispatch<SetStateAction<string | null>>,
    setModalNodeId: Dispatch<SetStateAction<string | undefined>>
) {
    setStoreModal('delete_node')
    setModalNodeId(nodeId)
}

function editorDeleteNode(
    modalNodeId: string | undefined,
    setModalNodeId: Dispatch<SetStateAction<string | undefined>>,
    nodes: IQuantaRFNode[],
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
) {
    if(modalNodeId === undefined)
        return

    let nNodes = []
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if(node.id=== modalNodeId)
            continue

        nNodes.push(node)
    }

    setModalNodeId(undefined)
    setNodes([ ...nNodes ])
}

export { 
    CreateMenuNode,
    trackNodeType,
    updateTrackedNodeType,
    deleteNode,
    editorDeleteNode 
}