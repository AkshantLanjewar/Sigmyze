import { IQuantaTypeRef } from "./node-type"

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
     * Quanta node signifies a node within the editor, while group stands for a
     * loops associated group
     */
    type?: 'quanta_node' | 'group',

    /**
     * This is the XY Position of the node in 
     * react-flow's screen space
     */
    position?: IQuantaXYPos,

    /**
     * This is the data that is stored in the react-flow node
     */
    data?: IQuantaRFNodeData,

    /**
     * if the node is a child of another group, the id of the parent group
     */
    parentNode?: string,

    /**
     * the node may not leave the group
     */
    extent?: 'parent',

    /**
     * styles if node is a group
     */
    style?: IQuantaRFNodeStyles
}

/**
 * implementation of RF node styles
 */
interface IQuantaRFNodeStyles {
    /**
     * height of the group
     */
    width?: number,

    /**
     * height of the group
     */
    height?: number
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
    nodeId?: string,

    /**
     * Theese are the custom types for sockets in the node
     */
    types?: IQuantaRFNodeDataType[],

    label?: null
}

/**
 * Implementation of the custom type for sockets in the node
 */
interface IQuantaRFNodeDataType {
    /**
     * id of the socket in the node
     */
    socketId?: string,

    /**
     * the socket's type
     */
    type?: IQuantaTypeRef
}

/**
 * The XY pos for a quanta node
 */
interface IQuantaXYPos {
    x: number,
    y: number
}

export type {
    IQuantaRFNode,
    IQuantaNodeDetails,
    IQuantaRFNodeData,
    IQuantaXYPos,
    IQuantaRFNodeDataType
}