import { IconCircleKey, IconInputSearch } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

/**
 * theese are the testing requirements to make sure that the get sdmx field key node fits into the rest of the codebase
 * 
 * Mount Test Requirements:
 *  - title = Get SDMX Field Key
 *  - there is one input block
 *  - input 0 = SDMX Field
 *  - there is one output block
 *  - output 0 = Field Key
 */

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