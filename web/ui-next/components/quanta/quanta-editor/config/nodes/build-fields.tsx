import { IconDatabaseImport, IconHammer, IconPlus } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/node-instructions";

const BuildField = {
    name: "Build Fields",
    icon: <IconHammer />,
    description: "Creates the field value for the indicator",

    inputs: [
        {
            dynamicSocket: true,
            groupTitle: "Dataset Fields",
            dynamicDepend: "quanta",
            quantaDepend: "schema"
        }
    ],

    outputs: [
        {
            socketId: "field",
            socketName: "Field",
            icon: <IconDatabaseImport />,
            type: {
                groupId: "quanta",
                typeId: "field"
            }
        }
    ],

    controls: [
        {
            activates: "quanta",
            quantaActivation: "new_field",
            id: "create_field_control",
            name: "Add Field",
            icon: <IconPlus />
        }
    ]
} as IQuantaNodeInstructions

export { BuildField }