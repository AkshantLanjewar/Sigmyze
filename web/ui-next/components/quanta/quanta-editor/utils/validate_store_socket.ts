import { IQuantaStoreItem } from "../types/types"

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

export { validateStoreSocket }