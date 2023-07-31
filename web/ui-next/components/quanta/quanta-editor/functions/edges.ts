import { IQuantaIterNodeType, IQuantaRFEdge, IQuantaRFNode, IQuantaTypeRef } from "../types/types";

function GetConnectedEdge(nodeId: string, type: "source" | "target", edges: IQuantaRFEdge[]) : IQuantaRFEdge | undefined {
    let edge = undefined
    for(let i = 0; i < edges.length; i++) {
        let edge_ = edges[i]
        if(edge_.source === nodeId && type === "source")
            edge = edge_
        if(edge_.target === nodeId && type === "target")
            edge = edge_
    }

    return edge
}

function GetParentId(nodeId: string, nodes: IQuantaRFNode[]) : string | undefined {
    let node = null
    for(let i = 0; i < nodes.length; i++) {
        let node_ = nodes[i]
        if(node_.id === nodeId)
            node = node_
    }

 
    if(node === null)
        return
    
    let parentId = node.parentNode
    return parentId
}

function SetIterNodeType(
    nodeId: string,
    nodeType: IQuantaTypeRef,
    iterNodeTypes: IQuantaIterNodeType[],
    setIterNodeTypes: (val: IQuantaIterNodeType[]) => void
) {
    let index = undefined
    for(let i = 0; i < iterNodeTypes.length; i++) {
        let nodeType = iterNodeTypes[i]
        if(nodeType.nodeId === nodeId)
            index = i
    }

    if(index === undefined) {
        let nNodeType = {} as IQuantaIterNodeType
        nNodeType.nodeId = nodeId
        nNodeType.type = nodeType

        let nIterNodeTypes = [...iterNodeTypes, nNodeType]
        setIterNodeTypes(nIterNodeTypes)
    } else {
        let node = iterNodeTypes[index]
        node.type = nodeType

        let nIterNodeTypes = iterNodeTypes
        nIterNodeTypes[index] = node
        setIterNodeTypes([ ...nIterNodeTypes ])
    }
}

function GetIterNodeType(nodeId: string, iterNodeTypes: IQuantaIterNodeType[]) {
    let nodeType = undefined
    for(let i = 0; i < iterNodeTypes.length; i++) {
        let nodeType_ = iterNodeTypes[i]
        if(nodeType_.nodeId === nodeId)
            nodeType = nodeType_.type
    }

    return nodeType
}

export { 
    GetConnectedEdge,
    GetParentId,
    SetIterNodeType,
    GetIterNodeType 
}