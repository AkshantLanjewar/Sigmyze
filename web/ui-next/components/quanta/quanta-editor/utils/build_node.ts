import { v4 } from "uuid"
import prebuildNodeDict from "../config/prebuilt_nodes"
import { IQuantaRFNode } from "../types/types"

/**
 * this function builds a RF node object for the editor
 * @param type 
 * 	the instruction id for how to construct the node
 * @param parentNode 
 * 	if the node is a child of an array group, the id of the parent group
 * @returns IQuantaRFNode | undefined
 */
function BuildNode(type: string, parentNode?: string): IQuantaRFNode | undefined {
	if (Object.keys(prebuildNodeDict).includes(type) === false)
		return

	let newNode = {} as IQuantaRFNode
	newNode.id = v4()
	newNode.type = "quanta_node"
	newNode.position = { x: 0, y: 0 }
	newNode.data = { instructionId: type, nodeId: newNode.id }
	
	if(parentNode !== undefined)
	{
		newNode.parentNode = parentNode
		newNode.expandParent = true
	}

	return newNode
}


/**
 * builds the store key from params
 * @param nodeId 
 * 	node id of the node
 * @param key 
 * 	key specified in the node instructions
 */
function buildStoreKey(nodeId: string, key: string) {
	return `${nodeId}_${key}`
}

/**
 * checks if a node is an array group
 * @param nodes 
 * 	list of nodes in editor
 * @param nodeId 
 * 	id of the node
 */
function isNodeArray(nodes: IQuantaRFNode[], nodeId: string) {
	for(let i = 0; i < nodes.length; i++) {
		let node = nodes[i]
		if(node.id === nodeId && node.type === "quanta_group")
			return true
	}

	return false
}

export { BuildNode, buildStoreKey, isNodeArray }