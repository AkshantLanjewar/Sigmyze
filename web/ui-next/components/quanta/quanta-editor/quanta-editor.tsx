import { createContext, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ReactFlow, Background, Controls, ReactFlowInstance } from "reactflow"
import { 
    IQuantaEditorGlobals, 
    IQuantaFormField, 
    IQuantaRFEdge, 
    IQuantaRFNode, 
    IQuantaStore, 
    IQuantaStoreData, 
    IQuantaXYPos,
} from "./types"

import 'reactflow/dist/style.css'
import { applyNodeChanges, applyEdgeChanges } from "@reactflow/core"
import QuantaNode from "./node/quanta-node"
import { BuildNode } from "./utils"

/**
 * This is the context created that stores all the node editor's global values
 */
const QuantaEditorContext = createContext<IQuantaEditorGlobals | null>(null)

const QuantaEditor: React.FC = ({  }) => {
    /**
     * This is a list of nodes within the editor
     * State managed by both react flow and component
     */
    const [nodes, setNodes] = useState<IQuantaRFNode[]>([])

    /**
     * This handles the list of edges within the react flow component
     */
    const [edges, setEdges] = useState<IQuantaRFEdge[]>([])

    /**
     * This is the xy position of the editor
     * collected on mount
     */
    const [editorBounds, setEditorBounds] = useState<IQuantaXYPos>({ x: 0, y: 0 })
    
    /**
     * This is the react flow instance provided by the onInit function
     */
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

    /**
     * State that handles the quanta store
     */
    const [quantaStore, setQuantaStore] = useState<IQuantaStore>({})

    //related to nodes within the editor
    /**
     * This is a toggle that can unfocus all the nodes within the editor
     */
    const [focusToggle, setFocusToggle] = useState(false)
    const toggleFocus = () => setFocusToggle(!focusToggle)

    const [storeToggle, setStoreToggle] = useState(false)
    const toggleUpdateStore = () => setStoreToggle(!storeToggle)

    /**
     * This is the react-flow related variables
     */
    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds) as any), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((ids: any) => applyEdgeChanges(changes, ids) as any), [])
    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode }), [])

    /**
     * Ref for the react flow element
     */
    const ref = useRef<HTMLDivElement>(null)

    /**
     * This is the mount effect.
     * handles creating the default start node, and getting the xy position of the container
     */
    useEffect(() => {
        let nNodes = []
        nNodes.push(BuildNode("start")!)
        setNodes([ ...nNodes ])

        if(ref.current === null)
            return
        const boundingBox = ref.current.getBoundingClientRect()
        setEditorBounds({ x: boundingBox.x, y: boundingBox.y })
    }, [])

    //definition for the createNode function
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

    function getStoreValue(storeKey: string) : IQuantaStoreData | undefined {
        let storeKeys = Object.keys(quantaStore)
        if(storeKeys.includes(storeKey) === undefined)
            return undefined

        let store = quantaStore[storeKey]
        return store
    }

    function createStore(storeKey: string, storeName: string, createFields: IQuantaFormField[], formTitle: string) {
        let newStore = {} as IQuantaStoreData
        newStore.name = storeName
        newStore.items = []
        newStore.form = createFields
        newStore.formTitle = formTitle

        let nStore = quantaStore
        nStore[storeKey] = newStore

        toggleUpdateStore()
        setQuantaStore({ ...nStore })
    }

    let value = {} as IQuantaEditorGlobals
    value.focusToggle = focusToggle
    value.storeToggle = storeToggle

    value.getStoreValue = getStoreValue
    value.createNode = CreateMenuNode
    value.toggleFocus = toggleFocus
    value.createStore = createStore

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