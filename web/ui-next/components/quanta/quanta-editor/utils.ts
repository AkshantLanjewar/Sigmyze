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

function compareTypes(a: IQuantaTypeRef, b: IQuantaTypeRef) {
	if(a === undefined || b === undefined)
		return false
	if(a.groupId !== b.groupId)
		return false
	if(a.typeId !== b.typeId)
		return false

	return true
}

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

function validateStoreSocket(item: IQuantaStoreItem) : boolean {
	if(item.addedKeys.includes("name") === false)
		return false
	if(item.addedKeys.includes("type") === false)
		return false
	if(item.addedKeys.includes("icon") === false)
		return false

	return true
}

function buildStoreKey(nodeId: string, key: string) {
	return `${nodeId}_${key}`
}

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

export {
	BuildNode,
	DetailedCreateList,
	validateStoreSocket,
	buildStoreKey,
	convertTypesToDropdown,
	getDetailedType,
	compareTypes,
	GetNodeSocket,
	buildEdge
}