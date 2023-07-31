import { Dispatch, RefObject, SetStateAction } from "react"
import { ReactFlowInstance } from "reactflow"
import { v4 } from "uuid"
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
    toggleFocus: () => void,
    groupId?: string
) {
    if(handleRef.current === null)
        return
    if(reactFlowInstance === null)
        return

    let nNodes = nodes
    let newNode = BuildNode(childType, groupId)!
    let handleCoords = handleRef.current.getBoundingClientRect()

    const position = reactFlowInstance.project({
        x: handleCoords.x - editorBounds.x,
        y: handleCoords.y - editorBounds.y - 70
    })

    newNode.position = position
    if(groupId !== undefined)
    {
        let parentNode = getNode(groupId, nodes)
        let parentPos = parentNode?.position
        if(parentPos === undefined)
            return

        position.x = position.x - parentPos.x
        position.y = position.y - parentPos.y
    }

    nNodes.push(newNode)

    toggleFocus()
    setNodes([ ...nNodes ])
}

function BuildIterNode(
    parentId: string,
    parentHandle: string,
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

    let handleCoords = handleRef.current.getBoundingClientRect()
    const position = reactFlowInstance.project({
        x: handleCoords.x - editorBounds.x,
        y: handleCoords.y - editorBounds.y - 70
    })

    let nNodes = nodes
    nNodes.push({
        id: v4(),
        type: 'quanta_group',
        position: position,
        data: {}, // to be set
        style: {
            width: 475,
            height: 250
        },
    })

    //build out the iter obj
    let groupId = nNodes[nNodes.length - 1].id
    nNodes.push(BuildNode("iter", groupId)!)


    setNodes([ ...nNodes ])
    toggleFocus()
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
    setModalNodeId: Dispatch<SetStateAction<string | undefined>>,
    setModalNodeBackend: Dispatch<SetStateAction<string | undefined>>,
    backend?: string,
) {
    setStoreModal('delete_node')
    setModalNodeId(nodeId)
    setModalNodeBackend(backend)
}

function _deleteNode(nodes: IQuantaRFNode[], modalNodeId: string, backend?: string) {
    let nNodes = []
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        
        if(node.id === modalNodeId)
            continue
        if(backend === "group" && node.parentNode === modalNodeId)
            continue

        nNodes.push(node)
    }
    
    return nNodes
}

function editorDeleteNode(
    modalNodeId: string | undefined,
    backend: string | undefined,
    setModalNodeId: Dispatch<SetStateAction<string | undefined>>,
    setModalNodeBackend: Dispatch<SetStateAction<string | undefined>>,
    nodes: IQuantaRFNode[],
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
) {
    if(modalNodeId === undefined)
        return

    let nNodes = null
    function quit() {
        setModalNodeBackend(undefined)
        setModalNodeId(undefined)
    }

    if(backend === undefined)
        nNodes = _deleteNode(nodes, modalNodeId)
    else
        nNodes = _deleteNode(nodes, modalNodeId, backend)

    if(nNodes === null) {
        quit()
        return
    }

    setNodes([ ...nNodes ])
    quit()
}

function getNode(nodeId: string, nodes: IQuantaRFNode[]) : IQuantaRFNode | undefined {
    let node = undefined
    for(let i = 0; i < nodes.length; i++) {
        let node_ = nodes[i]
        if(node_.id === nodeId)
            node = node_
    }

    return node
}

export { 
    CreateMenuNode,
    trackNodeType,
    updateTrackedNodeType,
    deleteNode,
    editorDeleteNode,
    BuildIterNode,
    getNode 
}