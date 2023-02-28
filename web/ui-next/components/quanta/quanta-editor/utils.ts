import { v4 } from "uuid"
import prebuildNodeDict from "./prebuilt_nodes"
import { IQuantaNodeDetails, IQuantaRFNode, IQuantaTypeRef } from "./types"

function BuildNode(type: string): IQuantaRFNode | undefined {
	if (Object.keys(prebuildNodeDict).includes(type) === false)
		return

	let newNode = {} as IQuantaRFNode
	newNode.id = v4()
	newNode.type = "quanta_node"
	newNode.position = { x: 0, y: 0 }
	newNode.data = { instructionId: type, nodeId: newNode.id }

	return newNode
}

function compareTypes(a: IQuantaTypeRef, b: IQuantaTypeRef) {
	return (a.groupId === b.groupId) && (a.typeId === b.typeId)
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
			if (compareTypes(input.type!, outputType))
				keysWithMatchingInputType.push(key)
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

export {
	BuildNode,
	DetailedCreateList
}