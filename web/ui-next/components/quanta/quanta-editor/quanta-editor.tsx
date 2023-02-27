import { useCallback, useEffect, useMemo, useState } from "react"
import { ReactFlow, Background, Controls } from "reactflow"
import { IQuantaRFEdge, IQuantaRFNode } from "./types"

import 'reactflow/dist/style.css'
import { applyNodeChanges, applyEdgeChanges } from "@reactflow/core"
import { v4 } from "uuid"
import QuantaNode from "./node/quanta-node"
import { BuildNode } from "./utils"

const QuantaEditor: React.FC = ({ }) => {
    const [nodes, setNodes] = useState<IQuantaRFNode[]>([])
    const [edges, setEdges] = useState<IQuantaRFEdge[]>([])

    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds) as any), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((ids: any) => applyEdgeChanges(changes, ids) as any), [])
    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode }), [])

    useEffect(() => {
        let nNodes = []
        nNodes.push(BuildNode("start")!)

        setNodes([ ...nNodes ])
    }, [])

    return (
        <div style={{ width: "100%", height: "100%", position: 'relative' }}>
            <ReactFlow
                nodes={nodes as any}
                edges={edges as any}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls /> 
            </ReactFlow>
        </div>
    )
}

export default QuantaEditor