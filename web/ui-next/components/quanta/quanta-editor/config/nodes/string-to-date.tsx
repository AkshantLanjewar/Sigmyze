import { IconCalendarEvent, IconTextRecognition } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/node-instructions"

/**
 * here are the testing requirements to make sure string-to-date integrates within the editor
 * 
 * Unit Test Requirements
 *  - title = String to Date
 *  - there is one input block
 *  - input 0 = Input String
 *  - there is one output block
 *  - output 0 = Date
 */

const StringToDate = {
    name: "String to Date",
    icon: <IconCalendarEvent />,
    description: "Converts a string to date, runtime error if not successfull",

    inputs: [
        {
            type: {
                groupId: "schema",
                typeId: "string"
            },
            socketId: "in_string",
            socketName: "Input String",
            icon: <IconTextRecognition />
        }
    ],
    outputs: [
        {
            type: {
                groupId: "schema",
                typeId: "date"
            },
            socketId: "out_date",
            socketName: "Date",
            icon: <IconCalendarEvent />
        }
    ]
} as IQuantaNodeInstructions

export { StringToDate }