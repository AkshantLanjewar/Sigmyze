import { Icon3dRotate, IconDatabaseImport, IconGraph, IconRefresh } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/node-instructions";

/**
 * theese are the testing spec requirements to validate update-indicator integrates into the editor
 * 
 * Mount Test
 *  - title = Update Indicator
 *  - there are 3 input blocks
 *  - input 0 = Update Mode
 *  - input 1 = Chart Data
 *  - input 2 = Query Fields
 *  - there are 0 output blocks
 */

const UpdateIndicator = {
    name: "Update Indicator",
    icon: <IconRefresh />,
    description: "Updates a Pre-existing indicator within the dataset",

    inputs: [
        {
            socketId: "mode",
            socketName: "Update Mode",
            icon: <Icon3dRotate />,
            staticSocket: true,
            selectableType: true,
            type: {
                groupId: "update_modes",
                typeId: "append"
            }
        },
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
            socketName: "Query Fields",
            icon: <IconDatabaseImport />,
            type: {
                groupId: "quanta",
                typeId: "field"
            }
        },
    ],
    outputs: []
} as IQuantaNodeInstructions

export { UpdateIndicator }