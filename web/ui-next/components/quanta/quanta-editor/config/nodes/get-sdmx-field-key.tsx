import { IconCircleKey, IconInputSearch } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

const GetSDMXFieldKey = {
    name: "Get SDMX Field Key",
    icon: <IconCircleKey />,
    description: "Retreives the key from a SDMX Field",

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
            socketId: "field_key",
            socketName: "Field Key",
            icon: <IconCircleKey />,
        }
    ]
} as IQuantaNodeInstructions

export { GetSDMXFieldKey }