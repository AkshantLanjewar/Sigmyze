import { Dispatch, SetStateAction } from "react"
import { Connection } from "reactflow"
import { buildEdge, GetNodeSocket, isNodeArray } from "."
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "../types/types"

function arrayConnection(
	params: Connection, 
	nodes: IQuantaRFNode[], 
	quantaStore: IQuantaStore,
	edges: IQuantaRFEdge[],
	setEdges: Dispatch<SetStateAction<IQuantaRFEdge[]>>
) {
	let sourceNode = params.source
	let targetNode = params.target
	if(sourceNode === null || targetNode === null)
		return

	let isSource = isNodeArray(nodes, sourceNode)

	let targetId = isSource ? targetNode : sourceNode
	let targetHandle = isSource ? params.targetHandle : params.sourceHandle 
	let handleType = isSource ?  "input" : "output"
	if(targetHandle === null)
		return

	let handleObject = GetNodeSocket(nodes, quantaStore, targetId, targetHandle, handleType as any)
	if(handleObject === undefined)
		return
	if(handleObject.isArray !== true)
		return

	if(isSource && handleObject.type?.typeId !== "thread")
		return

	let nEdge = {}
	if(handleType === "input")
		nEdge = buildEdge(sourceNode, sourceNode, targetNode, targetHandle)
	else
		nEdge = buildEdge(sourceNode, targetHandle, targetNode, targetNode)

	let nEdges = edges
	nEdges.push(nEdge)
	setEdges([ ...nEdges ])
}

export { arrayConnection }