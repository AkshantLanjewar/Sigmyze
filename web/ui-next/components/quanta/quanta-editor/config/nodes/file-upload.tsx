import { IconCloudUpload, IconEngine, IconPlus } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

const FileUpload = {
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
            storeKey: "file_upload",
            selectableType: true
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
} as IQuantaNodeInstructions

export { FileUpload }