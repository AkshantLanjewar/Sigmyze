import { IconCalendarEvent, IconTextRecognition } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/node-instructions"

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