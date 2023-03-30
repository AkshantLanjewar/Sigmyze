import typeGroups from "../config/quanta_types"
import { IQuantaType, IQuantaTypeRef } from "../types/types"

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

export { getDetailedType }