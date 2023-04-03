import { buildStoreKey } from "."
import { IQuantaSchema } from "../../schema-editor/types"
import prebuildNodeDict from "../config/prebuilt_nodes"
import { INodeExecutionResult } from "../execution-engine/context/types"
import { IQuantaRFNode, IQuantaSocket, IQuantaStore } from "../types/types"

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
	type: "input" | "output",
	executionResults?: INodeExecutionResult[],
	schema?: IQuantaSchema
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
	
	if(socketList === undefined && nodeInstructions === "iter")
	{
		let trackedTypes = node.data?.types
		if(trackedTypes === undefined || trackedTypes.length === 0)
			return

		let track = trackedTypes[0]
		let nSocket = {} as IQuantaSocket
		nSocket.socketId = socketId
		nSocket.type = track.type
		socketList = [ nSocket ]
	}
	
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
			if(socket_.dynamicDepend === "quanta") 
			{
				let quantaDepend = socket_.quantaDepend
				if(quantaDepend === "schema")
				{
					let schemaChildren = schema?.children
					if(schemaChildren === undefined)
						continue

					for(let x = 0; x < schemaChildren.length; x++) {
						let schemaChild = schemaChildren[x]
						if(schemaChild.nodeId === socketId) {
							//construct fake node
							let phantomSocket = {} as IQuantaSocket
							phantomSocket.type = schemaChild.quantaType
							phantomSocket.socketId = schemaChild.nodeId
							socket = phantomSocket
						}
					}
				}
			}

			if(socket_.dynamicDepend === "execution")
			{
				let executionField = socket_.executionField
				if(executionResults === undefined || executionField === undefined)
					continue

				let executionResult = undefined
				for(let x = 0; x < executionResults.length; x++) {
					let executionResult_ = executionResults[x]
					if(executionResult_.nodeId === nodeId && executionResult_.fieldId === executionField)
						executionResult = executionResult_
				}

				if(executionResult === undefined)
					continue

				let executionSockets = executionResult.computedSockets
				for(let x = 0; x < executionSockets.length; x++) {
					let tmpSocket = executionSockets[x]
					if(tmpSocket.socketId === socketId)
						socket = tmpSocket
				}
			}

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
					let storeItem = storeItems[x]
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

export { GetNodeSocket }