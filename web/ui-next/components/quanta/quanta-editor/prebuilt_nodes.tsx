import { IconPlayerPlay, IconEngine, IconCloudUpload, IconPlus } from "@tabler/icons"
import { v4 } from "uuid"
import { IQuantaNodeInstructions } from "./types"

const prebuildNodeDict = {
    "start": {
        name: "Start",
        icon: <IconPlayerPlay />,
        description: "This node signifies the start of execution for the file",
        
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
    },

    file_upload: {
        name: "File Upload",
        icon: <IconCloudUpload />,
        description: "Creates a modal that allows files to be uploaded",

        inputs: [
            {
                type: {
                    groupId: "base",
                    typeId: "thread"
                },
                socketId: "execute_input",
                socketName: "Execution Thread",
                icon: <IconEngine />,
                hideType: true
            }
        ],

        outputs: [
            {
                dynamicSocket: true,
                groupTitle: "Files",
                dynamicDepend: "store",
                storeKey: "file_upload"
            }
        ],

        controls: [
            {
                activates: "store",
                storeKey: "file_upload",
                id: "create_file_control",
                name: "Add File",
                icon: <IconPlus />
            }
        ]
    }
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict