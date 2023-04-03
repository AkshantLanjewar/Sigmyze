import { IQuantaType, IQuantaTypeRef } from "./types"

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
     * socket doesnt have a handle
     */
    staticSocket?: boolean,

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
     * this is the id for the group, used by the execution engine
     */
    groupId?: string,

    /**
     * This is the backend that the dynamic group depends on.
     * 
     * STORE: This backend constucts outputs based on what is in the editors store.
     * Requires a store key, and the stores data must have a name, type and icon for the output.
     * 
     * INPUT_VAL: This backend creates dynamic **INPUTS** based on the value of another input 
     * in the object. requires the id of the input being referenced, and a list of dependent input groups.
     * 
     * QUANTA: this backend creates dynamic sockets based on variables in the quanta context
     * 
     * EXECUTION: This creates dynamic sockets based on the result of a node's specific execution
     */
    dynamicDepend?: "store" | "input_val" | "quanta" | "execution",

    /**
     * This is the overall quanta project variable the socket depends on
     * 
     * SCHEMA: creates sockets based on schemas present in the project
     */
    quantaDepend?: "schema",

    /**
     * If the backend is a store, the key within the editors store to access the data
     */
    storeKey?: string,

    /**
     * The id ofthe input we want to make the dynamic inputs off of
     */
    inputId?: string,

    /**
     * The input definitions for the dynamic inputs
     */
    dependentInputs?: IQuantaDependentSocket[],

    /**
     * whether or not the socket's return type is an array
     */
    isArray?: boolean,

    /**
     * the type of item returned in the array
     */
    arrayType?: IQuantaTypeRef,

    /**
     * this is the execution field we will be referencing
     */
    executionField?: string,

    /**
     * whether or not the socket is linked to the dataset's fields
     */
    isDatasetField?: boolean,
}

/**
 * Type for a dependednt socket 
 */
interface IQuantaDependentSocket {
    /**
     * value needed to render sockets
     */
    inputValue?: string,

    /**
     * socket definitions
     */
    sockets: IQuantaSocket[]
}

/**
 * This is the control component for the nodes.
 * Creates buttons that can execute certain functions
 */
interface IQuantaControl {
    /**
     * The function the control can call.
     * 
     * STORE: This activates a store's create form
     */
    activates?: "store" | "quanta",

    quantaActivation?: "new_field",

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
    controls?: IQuantaControl[],

    /**
     * is the iter node
     */
    isIter?: boolean

    /**
     * whether or not the node caches data from the socket
     */
    cacheable?: boolean
}

export type {
    IQuantaSocket,
    IQuantaDependentSocket,
    IQuantaControl,
    IQuantaNodeInstructions
}