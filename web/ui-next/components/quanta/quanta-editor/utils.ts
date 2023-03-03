import { Dispatch, SetStateAction } from "react"
import { Connection, isNode } from "reactflow"
import { v4 } from "uuid"
import { IUIDropdownItem } from "../../ui/ui-dropdown/types"
import prebuildNodeDict from "./config/prebuilt_nodes"
import typeGroups from "./config/quanta_types"

import { 
	IQuantaNodeDetails, 
	IQuantaRFEdge, 
	IQuantaRFNode, 
	IQuantaSocket, 
	IQuantaStore, 
	IQuantaStoreItem, 
	IQuantaType, 
	IQuantaTypeRef 
} from "./types/types"

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
 * This function compares two type ref objects for equality
 * @param a 
 * 	type ref object 1
 * @param b 
 * 	type ref object 2
 * @returns boolean
 */
function compareTypes(a: IQuantaTypeRef, b: IQuantaTypeRef) {
	if(a === undefined || b === undefined)
		return false
	if(a.groupId !== b.groupId)
		return false
	if(a.typeId !== b.typeId)
		return false

	return true
}

/**
 * returns a list of objects that can accept the output type as an input
 * @param outputType 
 * 	the type of the output socket
 */
function DetailedCreateList(outputType: IQuantaTypeRef) {
	let keys = Object.keys(prebuildNodeDict)
	let keysWithMatchingInputType = []

	for (let i = 0; i < keys.length; i++) {
		let key = keys[i]
		let inputs = prebuildNodeDict[key].inputs
		if (inputs === undefined)
			continue

		for (let x = 0; x < inputs.length; x++) {
			let input = inputs[x]
			let flag = input.staticSocket === true
			if (compareTypes(input.type!, outputType) && !flag)
				keysWithMatchingInputType.push(key)

			//check if dependent socket group
			if(input.dynamicSocket === true && input.dynamicDepend === "input_val") {
				let subInputs = input.dependentInputs
				if(subInputs === undefined)
					continue

				for(let z = 0; z < subInputs.length; z++) {
					let subInput = subInputs[z]
					let subSockets = subInput.sockets
					if(subSockets === undefined)
						continue

					for(let y = 0; y < subSockets.length; y++) {
						let subSocket = subSockets[y]
						let subFlag = subSocket.staticSocket === true

						if(compareTypes(subSocket.type!, outputType) && !subFlag)
							keysWithMatchingInputType.push(key)
					}
				}
			}
		}
	}

	let detailedNodes = [] as IQuantaNodeDetails[]
	for (let i = 0; i < keysWithMatchingInputType.length; i++) {
		let key = keysWithMatchingInputType[i]
		let obj = prebuildNodeDict[key]

		detailedNodes.push({
			instructionId: key,
			name: obj.name!,
			description: obj.description!,
			icon: obj.icon! as JSX.Element
		})
	}

	return detailedNodes
}

/**
 * validates if an item within a store is a valid socket object
 * @param item 
 * 	the store item
 * @returns boolean
 */
function validateStoreSocket(item: IQuantaStoreItem) : boolean {
	if(item.addedKeys.includes("name") === false)
		return false
	if(item.addedKeys.includes("type") === false)
		return false
	if(item.addedKeys.includes("icon") === false)
		return false

	return true
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
 * convertys type group into dropdown list for dropdown component
 * @param groupId 
 * 	id of the type group
 */
function convertTypesToDropdown(groupId: string) : IUIDropdownItem[] | undefined {
	let group = null
	for(let i = 0; i < typeGroups.length; i++) {
		let group_ = typeGroups[i]
		if(group_.groupId === groupId)
			group = group_
	}

	if(group?.types === undefined)
		return

	let dropdownItems = [] as IUIDropdownItem[]
	for(let i = 0; i < group.types.length; i++) {
		let type = group.types[i] as IQuantaType
		let nDropdownItem = {} as IUIDropdownItem

		nDropdownItem.id = type.typeId!
		nDropdownItem.icon = type.typeIcon!
		nDropdownItem.description = type.typeDescription!
		nDropdownItem.name = type.typeName!
		dropdownItems.push(nDropdownItem)
	}

	return dropdownItems
}

/**
 * returns type object based on ref
 * @param ref 
 * 	ref of the type
 */
function getDetailedType(ref: IQuantaTypeRef) : undefined | IQuantaType {
	let groupId = ref.groupId
	if(groupId === undefined)
		return

	let group = undefined
	for(let i = 0; i < typeGroups.length; i++) {
		let group_ = typeGroups[i]
		if(group_.groupId === ref.groupId)
			group = group_
	}

	if(group === undefined)
		return
	if(group.types === undefined)
		return

	let type = undefined
	for(let i = 0; i < group.types.length; i++) {
		let type_ = group.types[i]
		if(type_.typeId === ref.typeId)
			type = type_
	}

	return type
}

/**
 * Gets an active socket within the editor
 * @param nodes 
 * 	nodes within the editor
 * @param quantaStore 
 * 	the quanta store of the editor
 * @param nodeId 
 * 	id of the node
 * @param socketId
 * 	id of the socket 
 * @param type 
 * 	whether input or output
 */
function GetNodeSocket(
	nodes: IQuantaRFNode[], 
	quantaStore: IQuantaStore, 
	nodeId: string, 
	socketId: string, 
	type: "input" | "output"
) {
	let node = null
	for(let i = 0; i < nodes.length; i++) {
		let node_ = nodes[i]
		if(node_.id === nodeId)
			node = node_
	}

	if(node === null)
		return

	//node instructions
	let nodeInstructions = node.data?.instructionId
	if(nodeInstructions === undefined)
		return
	if(node.type !== "quanta_node")
		return
	if (Object.keys(prebuildNodeDict).includes(nodeInstructions) === false)
		return

	const nodeInstruction = prebuildNodeDict[nodeInstructions]
	let socketList = null
	if(type === "input")
		socketList = nodeInstruction.inputs
	else
		socketList = nodeInstruction.outputs
	
	if(socketList === undefined)
		return

	//find the socket now
	let socket = undefined
	for(let i = 0; i < socketList.length; i++) {
		let socket_ = socketList[i]
		if(socket_.socketId === socketId)
			socket = socket_


		if(socket_.dynamicSocket === true)
		{	
			if(socket_.dynamicDepend === "store")
			{
				let storeKey = socket_.storeKey
				if(storeKey === undefined)
					continue

				let storeKeys = Object.keys(quantaStore)
				storeKey = buildStoreKey(node.id!, storeKey)
				if(storeKeys.includes(storeKey) === false)
					continue

				let store = quantaStore[storeKey]
				let storeItems = store.items
				if(storeItems === undefined)
					continue

				for(let x = 0; x < storeItems.length; x++) {
					let storeItem = storeItems[i]
					if(storeItem.id === socketId)
					{
						let storeData = storeItem.data
						let storeType = storeData.type
						if(storeType === undefined)
							continue

						let tmpSocket = {} as IQuantaSocket
						tmpSocket.type = storeType
						tmpSocket.socketId = storeItem.id
						socket = tmpSocket
					}
				}
			}

			if(socket_.dynamicDepend === "input_val")
			{
				let dependentInput = socket_.inputId
				if(dependentInput === undefined)
					continue

				//retreive the socket
				let dependentSocket = null
				for(let x = 0; x < socketList.length; x++) {
					let tmpSocket = socketList[x]
					if(tmpSocket.socketId === dependentInput)
						dependentSocket = tmpSocket
				}

				if(dependentSocket === null)
					continue

				let dependentValues = socket_.dependentInputs
				let dependentSockets = null
				let dependentValue = dependentSocket.type?.typeId
				if(dependentValues === undefined)
					continue

				for(let x = 0; x < dependentValues.length; x++) {
					let dependentVal = dependentValues[x]
					if(dependentVal.inputValue === dependentValue)
						dependentSockets = dependentVal.sockets
				}

				if(dependentSockets === null)
					continue

				for(let x = 0; x < dependentSockets.length; x++) {
					let dependentSocket = dependentSockets[x]
					if(dependentSocket.socketId === socketId)
						socket = dependentSocket
				}
			}
		}
	}

	return socket
}

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
	nEdge.type = "bezier"

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

	let nEdge = {}
	if(handleType === "input")
		nEdge = buildEdge(sourceNode, sourceNode, targetNode, targetHandle)
	else
		nEdge = buildEdge(sourceNode, targetHandle, targetNode, targetNode)

	let nEdges = edges
	nEdges.push(nEdge)
	setEdges([ ...nEdges ])
}

export {
	BuildNode,
	DetailedCreateList,
	validateStoreSocket,
	buildStoreKey,
	convertTypesToDropdown,
	getDetailedType,
	compareTypes,
	GetNodeSocket,
	buildEdge,
	isNodeArray,
	arrayConnection
}