import { IQuantaTypeRef } from "../types/types"

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

export { compareTypes }