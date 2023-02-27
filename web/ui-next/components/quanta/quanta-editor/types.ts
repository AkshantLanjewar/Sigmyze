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

interface IQuantaSocket {
    type?: string
    socketId?: string,
    socketName?: string,
    hideType?: boolean,
    icon?: React.ReactNode
}

interface IQuantaNodeInstructions {
    name?: string,
    icon?: React.ReactNode,
    description?: string

    outputs?: IQuantaSocket[],
    inputs?: IQuantaSocket[]
}

interface IQuantaXYPos {
    x: number,
    y: number
}

interface IQuantaRFEdge {

}

export type {
    IQuantaRFNode,
    IQuantaRFEdge,
    IQuantaXYPos,
    IQuantaRFNodeData,
    IQuantaNodeInstructions,
    IQuantaSocket,
    IQuantaNodeDetails
}