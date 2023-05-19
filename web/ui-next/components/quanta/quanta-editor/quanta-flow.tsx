import { Dispatch, SetStateAction, useCallback, useMemo, useContext, useEffect, useRef } from "react"
import { applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, ReactFlow, ReactFlowInstance, updateEdge } from "reactflow"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { ExecutionContextData } from "./execution-engine/context"
import { IExecutionEngineContext } from "./execution-engine/context/types"
import QuantaGroup from "./group/quanta-group"
import QuantaNode from "./node/quanta-node"
import { QuantaEditorContext } from "./quanta-editor"
import { IQuantaRFEdge } from "./types/edges"
import { IQuantaRFNode } from "./types/nodes"
import { IQuantaEditorGlobals, IQuantaSocket, IQuantaStore } from "./types/types"
import { arrayConnection, buildEdge, compareTypes, GetNodeSocket, isNodeArray } from "./utils"
import ConnectionLine from "./connection-line"

interface IQuantaFlowProps {
    nodes: IQuantaRFNode[],
    edges: IQuantaRFEdge[],
    quantaStore: IQuantaStore,
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
    setEdges: Dispatch<SetStateAction<IQuantaRFEdge[]>>,
    setReactFlowInstance: Dispatch<SetStateAction<ReactFlowInstance<any, any> | null>>,
    projectLoaded: boolean,
    fileId: string
}

const QuantaFlow: React.FC<IQuantaFlowProps> = ({ nodes, edges, quantaStore, setNodes, setEdges, setReactFlowInstance, projectLoaded, fileId }) => {
    const { getIterNodeType, viewOnly } = useContext(QuantaEditorContext) as IQuantaEditorGlobals
    const { executionResults } = useContext(ExecutionContextData) as IExecutionEngineContext
    const { getSchema, setEditorProject } = useContext(QuantaContextData) as IQuantaState

    const edgeUpdateSuccessful = useRef(true)
    
    useEffect(() => {
        if(projectLoaded === false)
            return
        if(viewOnly === true)
            return

        setEditorProject(fileId, nodes, edges, quantaStore, executionResults)
    }, [viewOnly, projectLoaded, fileId, nodes, edges, quantaStore, executionResults])

    let onNodesChange: ((changes: any) => void) = useCallback((changes: any) => {
        if(viewOnly === true)
            return

        setNodes((nds: any) => applyNodeChanges(changes, nds) as any)
    }, [viewOnly])

    //handlers relating towards edges
    let onEdgesChange: ((changes: any) => void) = useCallback((changes: any) => {
        if(viewOnly === true)
            return

        setEdges((ids: any) => applyEdgeChanges(changes, ids) as any)
    }, [viewOnly])

    const onEdgeUpdateStart = useCallback(() => {
        if(viewOnly === true)
            return

        edgeUpdateSuccessful.current = false
    }, [viewOnly])

    const onEdgeUpdate = useCallback((oldEdge: any, newConnection: any) => {
        if(viewOnly === true)
            return
        
        edgeUpdateSuccessful.current = true
        setEdges((els) => updateEdge(oldEdge, newConnection, els as any) as any)
    }, [viewOnly])

    const onEdgeUpdateEnd = useCallback((_: any, edge: any) => {
        if(viewOnly === true)
            return
        if(!edgeUpdateSuccessful.current)
            setEdges((eds: any) => eds.filter((e: any) => e.id !== edge.id))

        edgeUpdateSuccessful.current = true
    }, [viewOnly])

    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode, quanta_group: QuantaGroup }), [])

    const onConnect = useCallback((params: Connection) => {
        //source node vars
        let sourceNode = params.source
        let targetNode = params.target
        if(sourceNode === null || targetNode === null)
            return
        if(viewOnly === true)
            return

        if(isNodeArray(nodes, sourceNode) || isNodeArray(nodes, targetNode))
        {
            arrayConnection(params, nodes, quantaStore, edges, setEdges)
            return
        }

        //target node vars
        let sourceSocket = params.sourceHandle
        let targetSocket = params.targetHandle
        let schema = getSchema("dataset")
        if(sourceSocket === null || targetSocket === null)
            return

        let sourceSocketObject = GetNodeSocket(
            nodes, 
            quantaStore, 
            sourceNode, 
            sourceSocket, 
            "output", 
            executionResults, 
            schema
        )

        if(sourceSocketObject === undefined && sourceSocket === sourceNode)
        {
            let phantomSocket = {} as IQuantaSocket
            phantomSocket.type = getIterNodeType(sourceNode)
            if(phantomSocket.type === undefined)
                return

            sourceSocketObject = phantomSocket
        }

        const targetSocketObject = GetNodeSocket(
            nodes, 
            quantaStore, 
            targetNode, 
            targetSocket, 
            "input", 
            executionResults, 
            schema
        )

        if(sourceSocketObject === undefined || targetSocketObject === undefined)
            return

        if(compareTypes(sourceSocketObject.type!, targetSocketObject.type!) === true)
        {
            let nEdges = edges
            nEdges.push(buildEdge(sourceNode, sourceSocket, targetNode, targetSocket))

            setEdges([ ...nEdges ])
        }
    }, [nodes, quantaStore])

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
}

export default QuantaFlow