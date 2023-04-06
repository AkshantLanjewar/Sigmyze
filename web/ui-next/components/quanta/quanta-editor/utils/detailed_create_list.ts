import { compareTypes } from "."
import prebuildNodeDict from "../config/prebuilt_nodes"
import { IQuantaNodeDetails, IQuantaTypeRef } from "../types/types"

/**
 * returns a list of objects that can accept the output type as an input
 * @param outputType 
 * 	the type of the output socket
 */
function DetailedCreateList(outputType: IQuantaTypeRef, editorType: "create" | "update") {
	let keys = Object.keys(prebuildNodeDict)
	let keysWithMatchingInputType = []
	if(outputType.groupId === "schema")
		keysWithMatchingInputType.push("build_fields")

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

	//prune out based on the editorType
	let nKeys = []
	for(let i = 0; i < keysWithMatchingInputType.length; i++) {
		let key = keysWithMatchingInputType[i]
		if(key === "add_indicator" && editorType === "update")
			continue
		if(key === "update_indicator" && editorType === "update")
			continue

		nKeys.push(key)
	}

	let detailedNodes = [] as IQuantaNodeDetails[]
	for (let i = 0; i < nKeys.length; i++) {
		let key = nKeys[i]
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

export { DetailedCreateList }