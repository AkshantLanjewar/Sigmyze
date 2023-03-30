import { v4 } from "uuid"
import { IQuantaRFEdge } from "../types/types"

/**
 * builds an edge for the editor
 * @param sourceNode 
 * 	id for the emitter node
 * @param sourceHandle 
 * 	id for the emitter handle
 * @param targetNode 
 * 	id for the target node
 * @param targetHandle 
 * 	id for the target handle
 */
function buildEdge(sourceNode: string, sourceHandle: string, targetNode: string, targetHandle: string) {
	let nEdge = {} as IQuantaRFEdge
	nEdge.id = v4()

	nEdge.style = {
		strokeWidth: 3,
		stroke: "#ffffff"
	}
	
	nEdge.source = sourceNode
	nEdge.sourceHandle = sourceHandle
	nEdge.target = targetNode
	nEdge.targetHandle = targetHandle

	return nEdge
}

export { buildEdge }