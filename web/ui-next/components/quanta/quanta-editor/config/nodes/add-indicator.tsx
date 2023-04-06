import { IconDatabaseImport, IconGraph, IconStackPop } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/node-instructions"

const AddIndicator = {
    name: "Add Indicator",
    icon: <IconStackPop />,
    description: "Adds Indicator to the Dataset",

    inputs: [
        {
            socketId: "chart_data",
            socketName: "Chart Data",
            icon: <IconGraph />,
            type: {
                groupId: "quanta",
                typeId: "chart_data"
            }
        },
        {
            socketId: "field",
            socketName: "New Field",
            icon: <IconDatabaseImport />,
            type: {
                groupId: "quanta",
                typeId: "field"
            }
        }
    ],
    outputs: []
} as IQuantaNodeInstructions

export { AddIndicator }