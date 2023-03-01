import { RefObject } from "react"

/**
 * This is the node for the react flow object
 * stores all the info needed for react flow, and the info to create our quanta nodes
 */
interface IQuantaRFNode {
    /**
     * NOTE: Unique field
     * this is the id for the node
     */
    id?: string,

    /**
     * This is the react_flow type for the node
     * always set to quanta node so we can build custom nodes easier
     */
    type?: 'quanta_node',

    /**
     * This is the XY Position of the node in 
     * react-flow's screen space
     */
    position?: IQuantaXYPos,

    /**
     * This is the data that is stored in the react-flow node
     */
    data?: IQuantaRFNodeData
}

/**
 * This is the definition for accessing
 * detailed text descriptions of all the prebuilt nodes
 */
interface IQuantaNodeDetails {
    /**
     * This is the instruction id of the referenced node
     * NOTE: All prebuilt node definitions are stored in the prebuilt_nodes.tsx file
     */
    instructionId: string,

    /**
     * This is the name of the referened node
     */
    name: string,

    /**
     * This is the description for the node
     */
    description: string,

    /**
     * This is the icon for the node
     */
    icon: JSX.Element
}

/**
 * This is the definition for the data field in the 
 * IQuantaRFNode
 */
interface IQuantaRFNodeData {
    /**
     * This is the id for how to visually build the ui
     */
    instructionId?: string,
    
    /**
     * This is the node id of the created node
     * used to execute functions within the editor
     */
    nodeId?: string
}

/**
 * This is the object that defines a group of editor types.
 * Definitions found in quanta_types.tsx
 */
interface IQuantaTypeGroup {
    /**
     * Name for the group
     */
    groupName?: string,

    /**
     * Id for the group
     */
    groupId?: string,

    /**
     * List of types within the group
     */
    types?: IQuantaType[]
}

/**
 * This is a type stored in the IQuantaTypeGroup
 */
interface IQuantaType {
    /**
     * Id of the type
     */
    typeId?: string,

    /**
     * Name of the type
     */
    typeName?: string,

    /**
     * Icon for the type
     */
    typeIcon?: JSX.Element,

    /**
     * Description of the type
     */
    typeDescription?: string
}

/**
 * This is the definition for a socket (Input/Output)
 * for a node
 */
interface IQuantaSocket {
    /**
     * This is the type that the socket is
     */
    type?: IQuantaTypeRef

    /**
     * This is the id for the socket
     */
    socketId?: string,

    /**
     * This is the name for the socket
     */
    socketName?: string,

    /**
     * Whether or not the socket should visually display the 
     * type it is
     */
    hideType?: boolean,

    /**
     * This is the unique icon for the socket
     */
    icon?: React.ReactNode,

    /**
     * Whether or not the type is changeable for the object
     */
    selectableType?: boolean,

    /**
     * Whether or not the socket is a dynamic socket.
     * Dynamic sockets can create outputs based on certain values
     * outside of the Node's control
     */
    dynamicSocket?: boolean,

    /**
     * used to identify the sockets that are rendereed
     * within a dynamic socket renderer
     */
    dynamicSocketTag?: boolean,

    /**
     * This is the title for the dynamic group of outputs
     */
    groupTitle?: string,

    /**
     * This is the backend that the dynamic group depends on.
     * 
     * STORE: This backend constucts outputs based on what is in the editors store.
     * Requires a store key, and the stores data must have a name, type and icon for the output.
     */
    dynamicDepend?: "store",

    /**
     * If the backend is a store, the key within the editors store to access the data
     */
    storeKey?: string
}

/**
 * This is the control component for the nodes.
 * Creates buttons that can execute certain functions
 */
interface   IQuantaControl {
    /**
     * The function the control can call.
     * 
     * STORE: This activates a store's create form
     */
    activates?: "store",

    /**
     * if the backend is a store, the key to access the stores data
     */
    storeKey?: string,

    /**
     * The id of the control
     */
    id?: string,

    /**
     * The name for the control
     */
    name?: string,

    /**
     * The icon for the control
     */
    icon?: JSX.Element
}

/**
 * This is the structure that defines how quanta node visually gets created
 */
interface IQuantaNodeInstructions {
    /**
     * This is the name for the node
     */
    name?: string,

    /**
     * This is the icon for the node
     */
    icon?: React.ReactNode,

    /**
     * whether or not the node can be deleted / edited
     */
    immutableNode?: boolean,

    /**
     * This is the description of the node
     */
    description?: string

    /**
     * The nodes outputs
     */
    outputs?: IQuantaSocket[],

    /**
     * The nodes inputs
     */
    inputs?: IQuantaSocket[],

    /**
     * The nodes controls
     */
    controls?: IQuantaControl[]
}

/**
 * The XY pos for a quanta node
 */
interface IQuantaXYPos {
    x: number,
    y: number
}

/**
 * TODO: Add edges functionality
 */
interface IQuantaRFEdge {

}

/**
 * Data stored in the editors react context
 */
interface IQuantaEditorGlobals {
    /**
     * Toggle to remove all nodes focus
     * All quanta nodes subscribe to this value in an effect hook
     */
    focusToggle: boolean,

    /**
     * This is the toggle to update the dynamic data subscribed to stores
     */
    storeToggle: boolean,

    /**
     * Function that creates a new node within the editor
     * 
     * @param parentId
     *  the id of the node where the create function was called 
     * @param parentHandle 
     *  the handle where the create menu spawned from
     * @param childType 
     *  this is the new type of node that needs to be created
     * @param handleRef 
     *  this is the ref for the button that spawned the create menu
     */
    createNode: (parentId: string, parentHandle: string, childType: string, handleRef: RefObject<HTMLElement>) => void,

    /**
     * This retreives the store value with a given key
     * @param storeKey 
     *  This is the store key for the store that we are trying to retreive 
     * @returns 
     *  Store data or undefined if it isnt found
     */
    getStoreValue: (storeKey: string) => IQuantaStoreData | undefined,

    /**
     * This function creates a new store in the editor
     * @param storeKey 
     *  key for the store
     * @param storeName 
     *  name for the store
     * @param createFields
     *  the form to create new elements in the store
     */
    createStore: (storeKey: string, storeName: string, createFields: IQuantaFormField[], formTitle: string) => void,
    
    /**
     * This function opens the create item form for a specific store
     * @param modalKey 
     *  the key for the store we want the modal from
     * @returns 
     */
    createStoreModal: (modalKey: string) => void,

    /**
     * This is the function that edits a value within the store
     * @param storeKey 
     *  key for the store being accessed
     * @param itemId 
     *  id of the item we want to edit
     * @param key 
     *  key of the field we are trying to edit
     * @param field 
     *  value we want to replace the previous field with
     */
    editStoreValue: (storeKey: string, itemId: string, key: string, field: any) => void,

    deleteNode: (nodeId: string) => void,

    editorDeleteNode: () => void,

    deleteStoreItem: (storeKey: string, itemId: string) => void,

    /**
     * This function activates the focusToggle effects
     * unfocusing all the nodes in the editor
     */
    toggleFocus: () => void,
}

/**
 * This is a reference to the predefined types,
 * used by components within the editor
 */
interface IQuantaTypeRef {
    /**
     * This is the id of the group the type belongs too
     */
    groupId?: string,

    /**
     * This is the id of the type within the group
     */
    typeId?: string
}

/**
 * This is the store object that stores quanta editor variables
 */
interface IQuantaStore {
    /**
     * stores and accesses data based on a store key
     */
    [key: string]: IQuantaStoreData
}

type QuantaFormType = "text" | "dropdown" | "additional"

/**
 * Form field definitions
 */
interface IQuantaFormField {
    /**
     * input type
     */
    type?: QuantaFormType,

    /**
     * input name
     */
    name?: string,

    /**
     * Icon for the input
     */
    icon?: JSX.Element,

    /**
     * key in the dynamic object where value is stored
     */
    linkedKey?: string // links to a key within the data element in the store item,

    /**
     * this is the related dropdown field in the quanta_types file
     */
    dropdownField?: string,

    /**
     * additional fields that need to be added to the dynamic object
     */
    additionalFields?: IQuantaAdditionalField[],

    /**
     * id for the field
     */
    id?: string
}

/**
 * This is the additional field values
 */
interface IQuantaAdditionalField {
    /**
     * Key for the field
     */
    key: string,

    /**
     * value for the field
     */
    value: any
}

/**
 * This is the definition for an item within the store
 */
interface IQuantaStoreItem {
    /**
     * Id for the item
     */
    id?: string,

    /**
     * dynamic data holder
     */
    data: any,

    //TODO: Implement schema
    /**
     * keys added to the data
     */
    addedKeys: string[]
}

/**
 * This is the definition for the data stored in the store
 */
interface IQuantaStoreData {
    /**
     * Name of the store
     */
    name?: string,

    /**
     * Items that are stored within the store
     */
    items?: IQuantaStoreItem[],

    /**
     * form field definition for creating a new item
     */
    form?: IQuantaFormField[],

    /**
     * This is the title for the form
     */
    formTitle?: string,
}

export type {
    IQuantaRFNode,
    IQuantaRFEdge,
    IQuantaXYPos,
    IQuantaRFNodeData,
    IQuantaNodeInstructions,
    IQuantaSocket,
    IQuantaNodeDetails,
    IQuantaEditorGlobals,
    IQuantaStore,
    IQuantaStoreData,
    IQuantaTypeGroup,
    IQuantaType,
    IQuantaTypeRef,
    IQuantaFormField,
    IQuantaControl,
    IQuantaStoreItem,
    QuantaFormType,
    IQuantaAdditionalField
}