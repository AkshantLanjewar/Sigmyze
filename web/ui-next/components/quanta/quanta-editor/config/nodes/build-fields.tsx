import { IconDatabaseImport, IconHammer } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/node-instructions";

const BuildField = {
    name: "Build Fields",
    icon: <IconHammer />,
    description: "Converts individual values into a field value based on the schema for the dataset",

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
        
    ]
} as IQuantaNodeInstructions

export { BuildField }