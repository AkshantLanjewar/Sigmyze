import { IconDatabaseImport, IconGraph, IconStackPop } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/node-instructions"

/**
 * here are the test requirements to make sure add indicator integrates into its systems
 * 
 * Unit Test
 *  - title = Add Indicator
 *  - there are 2 input blocks
 *      - input 0 = Chart Data
 *      - input 1 = New Field
 *  - there are 0 output blocks
 */

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