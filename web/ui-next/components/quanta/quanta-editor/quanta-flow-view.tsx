import { Dispatch, FC, SetStateAction, memo } from "react";
import ReactFlow, { Background, Connection, Controls, ReactFlowInstance } from "reactflow";
import { IQuantaRFNode } from "./types/nodes";
import { IQuantaRFEdge } from "./types/edges";

interface IViewProps {
    nodes: IQuantaRFNode[],
    edges: IQuantaRFEdge[],
    nodeTypes: any,
    ConnectionLine: FC<any>,
    setReactFlowInstance: Dispatch<SetStateAction<ReactFlowInstance<any, any> | null>>,
    onNodesChange: (changes: any) => void,
    onEdgesChange: (changes: any) => void,
    onConnect: (params: Connection) => void,
    onEdgeUpdateStart: () => void,
    onEdgeUpdate: (oldEdge: any, newConnection: any) => void,
    onEdgeUpdateEnd: (_: any, edge: any) => void,
}

const QuantaFlowView: React.FC<IViewProps> = memo(({
    nodes,
    edges,
    nodeTypes,
    ConnectionLine,
    setReactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdateStart,
    onEdgeUpdate,
    onEdgeUpdateEnd
}) => {
    return (
        <>
            <ReactFlow
                nodes={nodes as any}
                edges={edges as any}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes as any}
                attributionPosition={'bottom-left'}
                onInit={setReactFlowInstance}
                onConnect={onConnect}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                connectionLineComponent={ConnectionLine as any}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </>
    )
})

export default QuantaFlowView