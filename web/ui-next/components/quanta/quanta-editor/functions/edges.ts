import { IQuantaRFEdge, IQuantaRFNode } from "../types/types";

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

export { 
    GetConnectedEdge,
    GetParentId 
}