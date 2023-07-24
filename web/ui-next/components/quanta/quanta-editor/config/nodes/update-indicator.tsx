import { Icon3dRotate, IconDatabaseImport, IconGraph, IconRefresh } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/node-instructions";

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