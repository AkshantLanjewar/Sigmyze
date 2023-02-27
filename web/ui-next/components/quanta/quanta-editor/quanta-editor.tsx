import { useCallback, useMemo, useState } from "react"
import { ReactFlow, Background, Controls } from "reactflow"
import { IQuantaRFEdge, IQuantaRFNode } from "./types"

import 'reactflow/dist/style.css'
import { applyNodeChanges, applyEdgeChanges } from "@reactflow/core"
import { v4 } from "uuid"
import QuantaNode from "./quanta-node"

const QuantaEditor: React.FC = ({ }) => {
    const defaultNode = {
        id: v4(),
        type: "quanta_node",
        position: { x: 0, y: 0 },
        data: { instructionId: "start" }
    } as IQuantaRFNode

    const [nodes, setNodes] = useState<IQuantaRFNode[]>([defaultNode])
    const [edges, setEdges] = useState<IQuantaRFEdge[]>([])

    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds) as any), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((ids: any) => applyEdgeChanges(changes, ids) as any), [])
    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode }), [])

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