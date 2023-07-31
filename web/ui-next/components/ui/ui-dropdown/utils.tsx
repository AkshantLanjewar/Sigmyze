import { IconDice6, IconTextRecognition, IconToggleLeft } from "@tabler/icons"
import { IUIDropdownItem } from "./types"

let schema_menu = [
    {
        id: "string",
        name: "String",
        description: "Can store text based data",
        icon: <IconTextRecognition size={18} stroke={2} />
    },
    {
        id: "number",
        name: "Number",
        description: "Can hold numerical values",
        icon: <IconDice6 size={18} stroke={2} />
    },
    {
        id: "boolean",
        name: "Boolean",
        description: "This can hold T/F values",
        icon: <IconToggleLeft size={18} stroke={2} />
    }
] as IUIDropdownItem[]

function GetPrebuiltDropdown(id: string) {
    if(id === "schema")
        return schema_menu

    return []
}

export { GetPrebuiltDropdown }