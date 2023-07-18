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

import { ReactFlowInstance } from "reactflow"

import { 
    IQuantaEditorGlobals, 
    IQuantaFormField, 
    IQuantaIterNodeType, 
    IQuantaRFEdge, 
    IQuantaRFNode, 
    IQuantaStore, 
    IQuantaTypeRef, 
    IQuantaXYPos,
} from "./types/types"

import 'reactflow/dist/style.css'

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
    GetIterNodeType, 
    getNode, 
    GetParentId, 
    getStoreValue, 
    SetIterNodeType, 
    submitStoreModal, 
    trackNodeType, 
    updateTrackedNodeType 
} from "./functions" 

import { IQuantaSchemaShort } from "../schema-editor/types"
import { QuantaContextData } from "../../data/quanta/context"

import { BuildNode, GetNodeSocket, LoadEditorProject } from "./utils"
import QuantaEditorView from "./quanta-editor-view"

interface IQuantaEditorProps {
    fileId: string,
    fileName: string,
    viewMode?: boolean
}

/**
 * This is the context created that stores all the node editor's global values
 */
const QuantaEditorContext = createContext<IQuantaEditorGlobals | null>(null)

const QuantaEditor: React.FC<IQuantaEditorProps> = ({ fileId, fileName, viewMode }) => {
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

    /**
     * state to relating what type of node editor
     */
    const [editorType, setEditorType] = useState<"create" | "update">("create")

    /**
     * whether or not the state has been loaded
     */
    const [projectLoaded, setProjectLoaded] = useState(false)

    /**
     * whether or not the project is in a view only mode
     */
    const [viewOnly, setViewOnly] = useState(false)

    //related to nodes within the editor
    /**
     * This is a toggle that can unfocus all the nodes within the editor
     */
    const [focusToggle, setFocusToggle] = useState(false)
    const toggleFocus = useCallback(() => setFocusToggle(!focusToggle), [focusToggle])

    const [edgeToggle, setEdgeToggle] = useState(false)
    const toggleEdge = useCallback(() => setEdgeToggle(!edgeToggle), [edgeToggle])

    const [nodeToggle, setNodeToggle] = useState(false)
    const toggleNode = () => setNodeToggle(!nodeToggle)

    const [storeToggle, setStoreToggle] = useState(false)
    const toggleUpdateStore = useCallback(() => setStoreToggle(!storeToggle), [storeToggle])

    const [formTitle, setFormTitle] = useState<string | undefined>("")
    const [formContent, setFormContent] = useState<IQuantaFormField[]>([])
    const [storeKey, setStoreKey] = useState<string | undefined>(undefined)
    const [storeModal, setStoreModal] = useState<string | null>(null)

    const [modalNodeId, setModalNodeId] = useState<string | undefined>(undefined)
    const [modalNodeBackend, setModalNodeBackend] = useState<string | undefined>(undefined)

    //the types for the iter nodes
    const [iterNodeTypes, setIterNodeTypes] = useState<IQuantaIterNodeType[]>([])

    //dataset types
    const [datasetTypes, setDatasetTypes] = useState<IQuantaSchemaShort[]>([])

    //when the engine wrapper should execute
    const [engineWrapperToggle, setEngineWrapperToggle] = useState(false)
    const toggleEngineWrapper = useCallback(() => setEngineWrapperToggle(!engineWrapperToggle), [engineWrapperToggle])

    //toggle for the engine
    const [engineCacheToggle, setEngineCacheToggle] = useState(false)
    const toggleEngineCache = useCallback(() => setEngineCacheToggle(!engineCacheToggle), [engineCacheToggle])

    //whether or not the editor has a node that has cachable data
    const [requiresCache, setRequiresCache] = useState(false)
    const hasCache = useCallback(() => setRequiresCache(true), [])

    const openStoreModal = useCallback(() => setStoreModal('store'), [])
    const closeStoreModal = useCallback(() => setStoreModal(null), [])

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

        LoadEditorProject(
            fileId, 
            fileName, 
            quantaContext.getEditorProject, 
            quantaContext.setEditorProject,
            setNodes,
            setEdges,
            setQuantaStore,
            setEditorType
        )

        setProjectLoaded(true)
    }, [fileId, fileName])

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

    useEffect(() => {
        if(viewMode === true)
            setViewOnly(true)
    }, [viewMode])

    const getStoreValueCallback = useCallback((storeKey: string) => {
        return getStoreValue(storeKey, quantaStore)
    }, [quantaStore])

    const createNodeCallback = useCallback((
        parentId: string, 
        parentHandle: string, 
        childType: string, 
        handleRef: RefObject<HTMLElement>, 
        groupId?: string
    ) => {
        return CreateMenuNode(
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
    }, [nodes, reactFlowInstance, editorBounds, toggleFocus])

    const createIterCallback = useCallback((parentId: string, parentHandle: string, handleRef: RefObject<HTMLElement>) => {
        return BuildIterNode(
            parentId,
            parentHandle,
            handleRef,
            nodes,
            reactFlowInstance,
            editorBounds,
            setNodes,
            toggleFocus
        )
    }, [nodes, reactFlowInstance, editorBounds, toggleFocus])

    const createStoreCallback = useCallback((storeKey: string, storeName: string, createFields: IQuantaFormField[], formTitle: string) => {
        return createStore(storeKey, storeName, createFields, formTitle, quantaStore, toggleUpdateStore, setQuantaStore)
    }, [quantaStore, toggleUpdateStore])

    const createStoreModalCallback = useCallback((modalKey: string) => {
        return createStoreModal(modalKey, quantaStore, setFormTitle, setFormContent, setStoreKey, openStoreModal)
    }, [quantaStore])

    const editStoreValueCallback = useCallback((storeKey: string, itemId: string, key: string, field: any) => {
        return editStoreValue(storeKey, itemId, key, field, quantaStore, setQuantaStore, toggleUpdateStore)
    }, [quantaStore, toggleUpdateStore])

    const deleteNodeCallback = useCallback((nodeId: string, backend?: string) => {
        return deleteNode(nodeId, setStoreModal, setModalNodeId, setModalNodeBackend, backend)
    }, [])

    const editorDeleteNodeCallback = useCallback(() => {
        return editorDeleteNode(modalNodeId, modalNodeBackend, setModalNodeId, setModalNodeBackend, nodes, setNodes)
    }, [modalNodeId, modalNodeBackend, nodes])

    const deleteStoreItemCallback = useCallback((storeKey: string, itemId: string) => {
        return deleteStoreItem(storeKey, itemId, quantaStore, setQuantaStore, toggleUpdateStore)
    }, [quantaStore, toggleUpdateStore])

    const trackNodeTypeCallback = useCallback((nodeId: string, socketId: string, type: IQuantaTypeRef) => {
        return trackNodeType(nodeId, socketId, type, nodes, setNodes)
    }, [nodes])

    const updateTrackedNodeTypeCallback = useCallback((nodeId: string, socketId: string, type: IQuantaTypeRef) => {
        return updateTrackedNodeType(nodeId, socketId, type, nodes, setNodes)
    }, [nodes])

    const getConnectedEdgeCallback = useCallback((nodeId: string, source: "source" | "target") => {
        return GetConnectedEdge(nodeId, source, edges)
    }, [edges])

    const getParentIdCallback = useCallback((nodeId: string) => {
        return GetParentId(nodeId, nodes)
    }, [nodes])

    const getNodeSocketCallback = useCallback((nodeId: string, socketId: string, type: "input" | "output") => {
        return GetNodeSocket(nodes, quantaStore, nodeId, socketId, type)
    }, [nodes, quantaStore])

    const getNodeCallback = useCallback((nodeId: string) => getNode(nodeId, nodes), [nodes])

    const setIterNodeTypeCallback = useCallback((nodeId: string, nodeType: IQuantaTypeRef) => {
        return SetIterNodeType(nodeId, nodeType, iterNodeTypes, setIterNodeTypes)
    }, [iterNodeTypes])

    const getIterNodeTypeCallback = useCallback((nodeId: string) => {
        return GetIterNodeType(nodeId, iterNodeTypes)
    }, [iterNodeTypes])

    let memoValue: IQuantaEditorGlobals = useMemo(() => ({
        focusToggle,
        storeToggle,
        edgeToggle,
        nodeToggle,
        editorType,
        fileId,
        viewOnly,
        getStoreValue: getStoreValueCallback,
        createNode: createNodeCallback,
        createIter: createIterCallback,
        toggleFocus: toggleFocus,
        createStore: createStoreCallback,
        createStoreModal: createStoreModalCallback,
        editStoreValue: editStoreValueCallback,
        deleteNode: deleteNodeCallback,
        editorDeleteNode: editorDeleteNodeCallback,
        deleteStoreItem: deleteStoreItemCallback,
        trackNodeType: trackNodeTypeCallback,
        updateTrackedNodeType: updateTrackedNodeTypeCallback,
        getConnectedEdge: getConnectedEdgeCallback,
        getParentId: getParentIdCallback,
        getNodeSocket: getNodeSocketCallback,
        getNode: getNodeCallback,
        setIterNodeType: setIterNodeTypeCallback,
        getIterNodeType: getIterNodeTypeCallback,
        hasCache: hasCache
    }), [
        focusToggle,
        storeToggle,
        edgeToggle,
        nodeToggle,
        editorType,
        fileId,
        viewOnly,
        getStoreValueCallback,
        createNodeCallback,
        createIterCallback,
        toggleFocus,
        createStoreCallback,
        createStoreModalCallback,
        editStoreValueCallback,
        deleteNodeCallback,
        editorDeleteNodeCallback,
        deleteStoreItemCallback,
        trackNodeTypeCallback,
        updateTrackedNodeTypeCallback,
        getConnectedEdgeCallback,
        getParentIdCallback,
        getNodeSocketCallback,
        getNodeCallback,
        setIterNodeTypeCallback,
        getIterNodeTypeCallback,
        hasCache
    ])

    const submitStoreModal_ = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: string}) => {
        return submitStoreModal(forms, valStore, storeKey, quantaStore, setQuantaStore, closeStoreModal, toggleUpdateStore)
    }, [])

    return (
        <QuantaEditorView
            ref={ref}
            requiresCache={requiresCache}
            viewOnly={viewOnly}
            fileId={fileId}
            memoValue={memoValue}
            engineWrapperToggle={engineWrapperToggle}
            engineCacheToggle={engineCacheToggle}
            nodes={nodes}
            edges={edges}
            quantaStore={quantaStore}
            storeModal={storeModal}
            formTitle={formTitle}
            formContent={formContent}
            projectLoaded={projectLoaded}
            setNodes={setNodes}
            setEdges={setEdges}
            setReactFlowInstance={setReactFlowInstance}
            closeStoreModal={closeStoreModal}
            toggleEngineWrapper={toggleEngineWrapper}
            toggleEngineCache={toggleEngineCache}
            submitStoreModal_={submitStoreModal_}
        />
    )
}

export { QuantaEditorContext }
export default QuantaEditor