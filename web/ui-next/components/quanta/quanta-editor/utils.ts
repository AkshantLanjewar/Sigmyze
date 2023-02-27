import { v4 } from "uuid"
import prebuildNodeDict from "./prebuilt_nodes"
import { IQuantaRFNode } from "./types"

function BuildNode(type: string) : IQuantaRFNode | undefined {
    if(Object.keys(prebuildNodeDict).includes(type) === false)
        return

    let newNode = {} as IQuantaRFNode
    newNode.id = v4()
    newNode.type = "quanta_node"
    newNode.position = { x: 0, y: 0 }
    newNode.data = { instructionId: "start", nodeId: newNode.id }

    return newNode
}

function DetailedCreateList(outputType: string) {
    let keys = Object.keys(prebuildNodeDict)
}

export { 
    BuildNode,
    DetailedCreateList 
}