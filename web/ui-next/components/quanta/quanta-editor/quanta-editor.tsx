import { 
    createContext, 
    RefObject, 
    useCallback, 
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
import { applyNodeChanges, applyEdgeChanges } from "@reactflow/core"
import QuantaNode from "./node/quanta-node"
import { BuildNode } from "./utils"
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
    getStoreValue, 
    submitStoreModal, 
    trackNodeType, 
    updateTrackedNodeType 
} from "./functions"
import QuantaGroup from "./group/quanta-group"

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

    const [formTitle, setFormTitle] = useState<string | undefined>("")
    const [formContent, setFormContent] = useState<IQuantaFormField[]>([])
    const [storeKey, setStoreKey] = useState<string | undefined>(undefined)
    const [storeModal, setStoreModal] = useState<string | null>(null)

    const [modalNodeId, setModalNodeId] = useState<string | undefined>(undefined)
    const [modalNodeBackend, setModalNodeBackend] = useState<string | undefined>(undefined)

    const openStoreModal = () => setStoreModal('store')
    const closeStoreModal = () => setStoreModal(null)

    /**
     * This is the react-flow related variables
     */
    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds) as any), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((ids: any) => applyEdgeChanges(changes, ids) as any), [])
    const nodeTypes = useMemo(() => ({ quanta_node: QuantaNode, quanta_group: QuantaGroup }), [])

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

    let value = {} as IQuantaEditorGlobals
    value.focusToggle = focusToggle
    value.storeToggle = storeToggle

    value.getStoreValue = (storeKey: string) => getStoreValue(storeKey, quantaStore)
    value.createNode = (parentId: string, parentHandle: string, childType: string, handleRef: RefObject<HTMLElement>) =>
        CreateMenuNode(
            parentId, 
            parentHandle, 
            childType, 
            handleRef, 
            nodes, 
            reactFlowInstance, 
            editorBounds, 
            setNodes, 
            toggleFocus
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