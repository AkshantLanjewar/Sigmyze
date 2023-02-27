interface IQuantaRFNode {
    id?: string,
    type?: 'quanta_node',
    position?: IQuantaXYPos,
    data?: IQuantaRFNodeData
}

interface IQuantaRFNodeData {
    instructionId?: string,
    instructions?: IQuantaNodeInstructions
}

interface IQuantaNodeOutput {
    type?: string
    outputId?: string,
    outputName?: string,
    hideType?: boolean,
    icon?: React.ReactNode
}

interface IQuantaNodeInstructions {
    name?: string,
    icon?: React.ReactNode,

    outputs?: IQuantaNodeOutput[]
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
    IQuantaNodeOutput
}