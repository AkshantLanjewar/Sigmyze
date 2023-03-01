import { IQuantaTypeRef } from "./types"

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
     * This is the backend that the dynamic group depends on.
     * 
     * STORE: This backend constucts outputs based on what is in the editors store.
     * Requires a store key, and the stores data must have a name, type and icon for the output.
     * 
     * INPUT_VAL: This backend creates dynamic **INPUTS** based on the value of another input 
     * in the object. requires the id of the input being referenced, and a list of dependent input groups.
     */
    dynamicDepend?: "store" | "input_val",

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
    dependentInputs?: IQuantaDependentSocket[]
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

export type {
    IQuantaSocket,
    IQuantaDependentSocket,
    IQuantaControl,
    IQuantaNodeInstructions
}