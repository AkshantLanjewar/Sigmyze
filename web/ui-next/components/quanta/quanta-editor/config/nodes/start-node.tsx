import { IconPlayerPlay, IconEngine } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/types";

const StartNode = {
    name: "Start",
    icon: <IconPlayerPlay />,
    description: "This node signifies the start of execution for the file",
    immutableNode: true,

    inputs: [],
    
    outputs: [
        {
            type: {
                groupId: "base",
                typeId: "thread"
            },
            socketId: "execute_output",
            socketName: "Execution Thread",
            icon: <IconEngine />,
            hideType: true
        }
    ]
} as IQuantaNodeInstructions

export { StartNode }