import { RefObject } from "react"

interface IQuantaRFNode {
    id?: string,
    type?: 'quanta_node',
    position?: IQuantaXYPos,
    data?: IQuantaRFNodeData
}

interface IQuantaNodeDetails {
    instructionId: string,
    name: string,
    description: string,
    icon: JSX.Element
}

interface IQuantaRFNodeData {
    instructionId?: string,
    instructions?: IQuantaNodeInstructions,
    nodeId?: string
}

interface IQuantaTypeGroup {
    groupName?: string,
    groupId?: string,
    types?: IQuantaType[]
}

interface IQuantaType {
    typeId?: string,
    typeName?: string,
    typeIcon?: JSX.Element,
    typeDescription?: string
}

interface IQuantaSocket {
    type?: IQuantaTypeRef
    socketId?: string,
    socketName?: string,
    hideType?: boolean,
    icon?: React.ReactNode,

    dynamicSocket?: boolean,
    groupTitle?: string,
    dynamicDepend?: "store",
    storeKey?: string
}

interface IQuantaControl {
    activates?: "store",
    storeKey?: string,
    id?: string,
    name?: string,
    icon?: string
}

interface IQuantaNodeInstructions {
    name?: string,
    icon?: React.ReactNode,
    description?: string

    outputs?: IQuantaSocket[],
    inputs?: IQuantaSocket[],
    controls?: IQuantaControl[]
}

interface IQuantaXYPos {
    x: number,
    y: number
}

interface IQuantaRFEdge {

}

interface IQuantaEditorGlobals {
    focusToggle: boolean,

    createNode: (parentId: string, parentHandle: string, childType: string, handleRef: RefObject<HTMLElement>) => void,
    toggleFocus: () => void
}

interface IQuantaTypeRef {
    groupId?: string,
    typeId?: string
}

interface IQuantaStore {
    [key: string]: IQuantaStoreData[]
}

interface IQuantaFormField {
    type?: string,
    name?: string,
    icon?: JSX.Element,
    linkedKey?: string // links to a key within the data element in the store item
}

interface IQuantaStoreItem {
    id?: string,
    data: any
}

interface IQuantaStoreData {
    name?: string,
    items?: IQuantaStoreItem[] ,
    form?: IQuantaFormField[]
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
    IQuantaControl
}