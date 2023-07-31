import { IUIDropdownItem } from "../../../ui/ui-dropdown/types"
import typeGroups from "../config/quanta_types"
import { IQuantaType } from "../types/types"

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

export { convertTypesToDropdown }