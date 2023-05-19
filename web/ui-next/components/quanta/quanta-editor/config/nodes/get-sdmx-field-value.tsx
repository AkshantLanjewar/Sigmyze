import { IconBox, IconInputSearch } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

const GetSDMXFieldValue = {
    name: "Get SDMX Field Value",
    icon: <IconBox />,
    description: "Retreives the value from a SDMX Field",

    inputs: [
        {
            type: {
                groupId: "base",
                typeId: "sdmx_field"
            },
            socketId: "sdmx_field",
            socketName: "SDMX Field",
            icon: <IconInputSearch />
        }
    ],

    outputs: [
        {
            type: {
                groupId: "schema",
                typeId: "string"
            },
            socketId: "field_value",
            socketName: "Field Value",
            icon: <IconBox />,
        }
    ]
} as IQuantaNodeInstructions

export { GetSDMXFieldValue }