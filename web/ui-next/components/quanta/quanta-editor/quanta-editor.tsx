import { 
    createContext, 
    RefObject, 
    useCallback, 
    useContext, 
    useEffect, 
    useMemo, 
    useRef, 
    useState 
} from "react"

import { 
    ReactFlow, 
    Background, 
    Controls, 
    ReactFlowInstance 
} from "reactflow"

import { 
    IQuantaEditorGlobals, 
    IQuantaFormField, 
    IQuantaRFEdge, 
    IQuantaRFNode, 
    IQuantaStore, 
    IQuantaTypeRef, 
    IQuantaXYPos,
} from "./types/types"

import 'reactflow/dist/style.css'
import { applyNodeChanges, applyEdgeChanges, Connection } from "@reactflow/core"
import QuantaNode from "./node/quanta-node"
import { arrayConnection, buildEdge, BuildNode, compareTypes, GetNodeSocket, isNodeArray } from "./utils"
import ModalManager from "../../ui/modal-manager"
import FormBuilder from "../form-builder/form-builder"
import DeleteNodeForm from "./forms/delete-node-form"

import { 
    BuildIterNode,
    CreateMenuNode, 
    createStore, 
    createStoreModal, 
    deleteNode, 
    deleteStoreItem, 
    editorDeleteNode, 
    editStoreValue, 
    GetConnectedEdge, 
    getNode, 
    GetParentId, 
    getStoreValue, 
    submitStoreModal, 
    trackNodeType, 
    updateTrackedNodeType 
} from "./functions"
import QuantaGroup from "./group/quanta-group"
import { IQuantaSchemaShort } from "../schema-editor/types"
import QuantaContext, { QuantaContextData } from "../../data/quanta/context"
import { v4 } from "uuid"

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

    const [edgeToggle, setEdgeToggle] = useState(false)
    const toggleEdge = () => setEdgeToggle(!edgeToggle)

    const [nodeToggle, setNodeToggle] = useState(false)
    const toggleNode = () => setNodeToggle(!nodeToggle)

    const [storeToggle, setStoreToggle] = useState(false)
    const toggleUpdateStore = () => setStoreToggle(!storeToggle)

    const [formTitle, setFormTitle] = useState<string | undefined>("")
    const [formContent, setFormContent] = useState<IQuantaFormField[]>([])
    const [storeKey, setStoreKey] = useState<string | undefined>(undefined)
    const [storeModal, setStoreModal] = useState<string | null>(null)

    const [modalNodeId, setModalNodeId] = useState<string | undefined>(undefined)
    const [modalNodeBackend, setModalNodeBackend] = useState<string | undefined>(undefined)

    //dataset types
    const [datasetTypes, setDatasetTypes] = useState<IQuantaSchemaShort[]>([])

    const openStoreModal = () => setStoreModal('store')
    const closeStoreModal = () => setStoreModal(null)

    /**
     * This is the react-flow related variables
     */
    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds) as any), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((ids: any) => applyEdgeChanges(changes, ids) as any), [])
    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode, quanta_group: QuantaGroup }), [])

    //when edges connect
    const onConnect = useCallback((params: Connection) => {
        //source node vars
        let sourceNode = params.source
        let targetNode = params.target
        if(sourceNode === null || targetNode === null)
            return

        if(isNodeArray(nodes, sourceNode) || isNodeArray(nodes, targetNode))
        {
            arrayConnection(params, nodes, quantaStore, edges, setEdges)
            return
        }
        
        //target node vars
        let sourceSocket = params.sourceHandle
        let targetSocket = params.targetHandle
        if(sourceSocket === null || targetSocket === null)
            return

        const sourceSocketObject = GetNodeSocket(nodes, quantaStore, sourceNode, sourceSocket, "output")
        const targetSocketObject = GetNodeSocket(nodes, quantaStore, targetNode, targetSocket, "input")
        if(sourceSocketObject === undefined || targetSocketObject === undefined)
            return

        if(compareTypes(sourceSocketObject.type!, targetSocketObject.type!) === true)
        {
            let nEdges = edges
            nEdges.push(buildEdge(sourceNode, sourceSocket, targetNode, targetSocket))

            setEdges([ ...nEdges ])
        }
    }, [nodes, quantaStore])

    /**
     * Ref for the react flow element
     */
    const ref = useRef<HTMLDivElement>(null)

    /**
     * greater quanta context
     */
    const quantaContext = useContext(QuantaContextData)

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

    useEffect(() => {
        toggleEdge()
    }, [edges])

    useEffect(() => {
        if(quantaContext === null)
            return

        let quantaSchema = quantaContext.getSchema("dataset")
        if(quantaSchema === undefined)
        {
            quantaContext.initSchema("dataset")
            return
        }

        let schemaChildren = quantaSchema.children
        if(schemaChildren === undefined)
            return
        
        let nDatasetTypes = [] as IQuantaSchemaShort[]
        for(let i = 0; i < schemaChildren.length; i++) {
            let schemaObject = schemaChildren[i]
            if(schemaObject.name === undefined || schemaObject.quantaType === undefined || schemaObject.nodeId === undefined)
                continue

            nDatasetTypes.push({
                name: schemaObject.name,
                type: schemaObject.quantaType,
                id: schemaObject.nodeId
            })
        }

        setDatasetTypes([ ...nDatasetTypes ])
    }, [quantaContext?.updateEditorSchema])

    let value = {} as IQuantaEditorGlobals
    value.focusToggle = focusToggle
    value.storeToggle = storeToggle
    value.edgeToggle = edgeToggle
    value.nodeToggle = nodeToggle

    value.getStoreValue = (storeKey: string) => 
        getStoreValue(storeKey, quantaStore)
    value.createNode = (parentId: string, parentHandle: string, childType: string, handleRef: RefObject<HTMLElement>, groupId?: string) =>
        CreateMenuNode(
            parentId, 
            parentHandle, 
            childType, 
            handleRef, 
            nodes, 
            reactFlowInstance, 
            editorBounds, 
            setNodes, 
            toggleFocus,
            groupId
        )
    value.createIter = (parentId: string, parentHandle: string, handleRef: RefObject<HTMLElement>) =>
        BuildIterNode(
            parentId, 
            parentHandle, 
            handleRef, 
            nodes, 
            reactFlowInstance, 
            editorBounds, 
            setNodes, 
            toggleFocus
        )
    value.toggleFocus = toggleFocus
    value.createStore = (storeKey: string, storeName: string, createFields: IQuantaFormField[], formTitle: string) =>
        createStore(storeKey, storeName, createFields, formTitle, quantaStore, toggleUpdateStore, setQuantaStore)
    value.createStoreModal = (modalKey: string) =>
        createStoreModal(modalKey, quantaStore, setFormTitle, setFormContent, setStoreKey, openStoreModal)
    value.editStoreValue = (storeKey: string, itemId: string, key: string, field: any) =>
        editStoreValue(storeKey, itemId, key, field, quantaStore, setQuantaStore, toggleUpdateStore)
    value.deleteNode = (nodeId: string, backend?: string) => 
        deleteNode(nodeId, setStoreModal, setModalNodeId, setModalNodeBackend, backend)
    value.editorDeleteNode = () => 
        editorDeleteNode(modalNodeId, modalNodeBackend, setModalNodeId, setModalNodeBackend, nodes, setNodes)
    value.deleteStoreItem = (storeKey: string, itemId: string) =>
        deleteStoreItem(storeKey, itemId, quantaStore, setQuantaStore, toggleUpdateStore)
    value.trackNodeType = (nodeId: string, socketId: string, type: IQuantaTypeRef) =>
        trackNodeType(nodeId, socketId, type, nodes, setNodes)
    value.updateTrackedNodeType = (nodeId: string, socketId: string, type: IQuantaTypeRef) =>
        updateTrackedNodeType(nodeId, socketId, type, nodes, setNodes)
    value.getConnectedEdge = (nodeId: string, source: "source" | "target") =>
        GetConnectedEdge(nodeId, source, edges)
    value.getParentId = (nodeId: string) =>
        GetParentId(nodeId, nodes)
    value.getNodeSocket = (nodeId: string, socketId: string, type: "input" | "output") =>
        GetNodeSocket(nodes, quantaStore, nodeId, socketId, type)
    value.getNode = (nodeId: string) => getNode(nodeId, nodes)

    const submitStoreModal_ = (forms: IQuantaFormField[], valStore: {[key: string]: string}) =>
        submitStoreModal(forms, valStore, storeKey, quantaStore, setQuantaStore, closeStoreModal, toggleUpdateStore)

    return (
        <div 
            ref={ref}
            style={{ width: "100%", height: "100%", position: 'relative' }}
        >
            <QuantaEditorContext.Provider value={value}>
                <>
                    <ModalManager
                        modalState={storeModal}
                        close={closeStoreModal}
                    >
                        <ModalManager.Modal
                            id="store"
                            title={formTitle!}
                        >
                            <FormBuilder 
                                forms={formContent} 
                                closeModal={closeStoreModal}
                                submit={submitStoreModal_}
                            />
                        </ModalManager.Modal>

                        <ModalManager.Modal
                            id={"delete_node"}
                            title={"Are you Sure?"}
                        >
                            <DeleteNodeForm     
                                opened={storeModal === "delete_node"} 
                                closeModal={closeStoreModal}
                            />
                        </ModalManager.Modal>
                    </ModalManager>

                    <ReactFlow
                        nodes={nodes as any}
                        edges={edges as any}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes as any}
                        attributionPosition={'bottom-left'}
                        onInit={setReactFlowInstance}
                        onConnect={onConnect}
                    >
                        <Background />
                        <Controls /> 
                    </ReactFlow>
                </>
            </QuantaEditorContext.Provider>
        </div>
    )
}

export { QuantaEditorContext }
export default QuantaEditor