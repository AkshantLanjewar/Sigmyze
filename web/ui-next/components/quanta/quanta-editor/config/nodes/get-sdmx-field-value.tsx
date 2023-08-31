import { IconBox, IconInputSearch } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

/**
 * theese are the testing requirements to make sure get-sdmx-field value in the node editor
 * 
 * Mount Test Requirements:
 *  - title = Get SDMX Field Value
 *  - there is one input block
 *  - input 0 = SDMX Field
 *  - there is one output block
 *  - output 0 = Field Value
 */

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