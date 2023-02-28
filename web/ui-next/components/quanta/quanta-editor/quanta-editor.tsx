import { createContext, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ReactFlow, Background, Controls, ReactFlowInstance } from "reactflow"
import { IQuantaEditorGlobals, IQuantaRFEdge, IQuantaRFNode, IQuantaXYPos } from "./types"

import 'reactflow/dist/style.css'
import { applyNodeChanges, applyEdgeChanges } from "@reactflow/core"
import QuantaNode from "./node/quanta-node"
import { BuildNode } from "./utils"

const QuantaEditorContext = createContext<IQuantaEditorGlobals | null>(null)

const QuantaEditor: React.FC = ({  }) => {
    const [nodes, setNodes] = useState<IQuantaRFNode[]>([])
    const [edges, setEdges] = useState<IQuantaRFEdge[]>([])
    const [editorBounds, setEditorBounds] = useState<IQuantaXYPos>({ x: 0, y: 0 })
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

    //related to nodes within the editor
    const [focusToggle, setFocusToggle] = useState(false)
    const toggleFocus = () => setFocusToggle(!focusToggle)

    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds) as any), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((ids: any) => applyEdgeChanges(changes, ids) as any), [])
    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode }), [])

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let nNodes = []
        nNodes.push(BuildNode("start")!)
        setNodes([ ...nNodes ])

        if(ref.current === null)
            return
        const boundingBox = ref.current.getBoundingClientRect()
        setEditorBounds({ x: boundingBox.x, y: boundingBox.y })
    }, [])

    function CreateMenuNode(parentId: string, parentHandle: string, childType: string, handleRef: RefObject<HTMLElement>) {
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

    let value = {} as IQuantaEditorGlobals
    value.focusToggle = focusToggle
    value.createNode = CreateMenuNode
    value.toggleFocus = toggleFocus

    return (
        <div 
            ref={ref}
            style={{ width: "100%", height: "100%", position: 'relative' }}
        >
            <QuantaEditorContext.Provider value={value}>
                <ReactFlow
                    nodes={nodes as any}
                    edges={edges as any}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    onInit={setReactFlowInstance}
                >
                    <Background />
                    <Controls /> 
                </ReactFlow>
            </QuantaEditorContext.Provider>
        </div>
    )
}

export { QuantaEditorContext }
export default QuantaEditor