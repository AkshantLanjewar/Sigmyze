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
    IQuantaStoreData, 
    IQuantaStoreItem, 
    IQuantaTypeRef, 
    IQuantaXYPos,
} from "./types"

import 'reactflow/dist/style.css'
import { applyNodeChanges, applyEdgeChanges } from "@reactflow/core"
import QuantaNode from "./node/quanta-node"
import { BuildNode } from "./utils"
import ModalManager from "../../ui/modal-manager"
import FormBuilder from "../form-builder/form-builder"
import { v4 } from "uuid"
import DeleteNodeForm from "./forms/delete-node-form"

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

    const openStoreModal = () => setStoreModal('store')
    const closeStoreModal = () => setStoreModal(null)

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

    function createStoreModal(modalKey: string) {
        let storeKeys = Object.keys(quantaStore)
        if(storeKeys.includes(modalKey) === false)
            return

        let store = quantaStore[modalKey]

        setFormTitle(store.formTitle)
        setFormContent([ ...store.form! ])
        setStoreKey(modalKey)
        openStoreModal()
    }

    function createStoreItem(storeKey: string, data: any) {
        let storeKeys = Object.keys(quantaStore)
        if(storeKeys.includes(storeKey) === undefined)
            return

        let store = quantaStore[storeKey]
        let items = store.items
        if(items === undefined)
            items = []

        let nItem = {} as IQuantaStoreItem
        nItem.id = v4()
        nItem.data = data
        nItem.addedKeys = Object.keys(data)
        items.push(nItem)

        let nStore = quantaStore
        store.items = items
        nStore[storeKey] = store

        setQuantaStore({ ...nStore })
    }

    function submitStoreModal(forms: IQuantaFormField[], valStore: {[key: string]: string}) {
        let data = {} as any
        if(storeKey === undefined)
            return

        for(let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if(form.type === "text" || form.type === "dropdown") {
                if(form.linkedKey === undefined)
                    continue
                if(form.id === undefined)
                    continue
                
                let val = valStore[form.id]
                if(val === undefined || val.length === 0)
                    return

                data[form.linkedKey] = val
                if(form.type === "dropdown") {
                    let type = {} as IQuantaTypeRef
                    type.groupId = form.dropdownField
                    type.typeId = val
                    
                    data[form.linkedKey] = type
                }
            }

            if(form.type === "additional") {
                let additionalAdds = form.additionalFields
                if(additionalAdds === undefined)
                    continue

                for(let x = 0; x < additionalAdds.length; x++) {
                    let field = additionalAdds[x]
                    data[field.key] = field.value
                }
            }
        }
        
        createStoreItem(storeKey, data)
        closeStoreModal()
        toggleUpdateStore()
    }

    function editStoreValue(storeKey: string, itemId: string, key: string, field: any) {
        let storeKeys = Object.keys(quantaStore)
        if(storeKeys.includes(storeKey) === undefined)
            return

        let store = quantaStore[storeKey]
        let items = store.items
        if(items === undefined)
            return

        let nItems = []
        for(let i = 0; i < items.length; i++) {
            let item = items[i]
            if(item.id === itemId)
                item.data[key] = field

            nItems.push(item)
        }

        let nQuantaStore = quantaStore
        store.items = nItems
        nQuantaStore[storeKey] = { ...store }
        
        setQuantaStore({ ...nQuantaStore })
        toggleUpdateStore()
    }

    function deleteStoreItem(storeKey: string, itemId: string) {
        let storeKeys = Object.keys(quantaStore)
        if(storeKeys.includes(storeKey) === undefined)
            return

        let store = quantaStore[storeKey]
        let items = store.items
        if(items === undefined)
            return

        let nItems = []
        for(let i = 0; i < items.length; i++) {
            let item = items[i]
            if(item.id === itemId)
                continue

            nItems.push(item)
        }

        let nQuantaStore = quantaStore
        store.items = nItems
        nQuantaStore[storeKey] = { ...store }
        
        setQuantaStore({ ...nQuantaStore })
        toggleUpdateStore()
    }

    function deleteNode(nodeId: string) {
        setStoreModal('delete_node')
        setModalNodeId(nodeId)
    }

    function editorDeleteNode() {
        if(modalNodeId === undefined)
            return

        let nNodes = []
        for(let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            if(node.id=== modalNodeId)
                continue

            nNodes.push(node)
        }

        setModalNodeId(undefined)
        setNodes([ ...nNodes ])
    }

    let value = {} as IQuantaEditorGlobals
    value.focusToggle = focusToggle
    value.storeToggle = storeToggle

    value.getStoreValue = getStoreValue
    value.createNode = CreateMenuNode
    value.toggleFocus = toggleFocus
    value.createStore = createStore
    value.createStoreModal = createStoreModal
    value.editStoreValue = editStoreValue
    value.deleteNode = deleteNode
    value.editorDeleteNode = editorDeleteNode
    value.deleteStoreItem = deleteStoreItem

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
                                submit={submitStoreModal}
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
                        nodeTypes={nodeTypes}
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