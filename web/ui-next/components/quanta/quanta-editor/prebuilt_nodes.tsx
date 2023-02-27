import { IconPlayerPlay, IconEngine, IconCloudUpload } from "@tabler/icons"
import { IQuantaNodeInstructions } from "./types"

const prebuildNodeDict = {
    "start": {
        name: "Start",
        icon: <IconPlayerPlay />,
        description: "This node signifies the start of execution for the file",
        
        outputs: [
            {
                type: "thread",
                socketId: "execute_output",
                socketName: "Execution Thread",
                icon: <IconEngine />,
                hideType: true
            }
        ]
    },

    file_upload: {
        name: "File Upload",
        icon: <IconCloudUpload />,
        description: "Creates a modal that allows files to be uploaded",

        inputs: [
            {
                type: "thread",
                socketId: "execute_input",
                socketName: "Execution Thread",
                icon: <IconEngine />,
                hideType: true
            }
        ]
    }
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict