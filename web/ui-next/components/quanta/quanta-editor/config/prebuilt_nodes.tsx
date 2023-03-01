import { IconPlayerPlay, IconEngine, IconCloudUpload, IconPlus, IconBraces, IconGitCompare } from "@tabler/icons"
import { v4 } from "uuid"
import { IQuantaNodeInstructions } from "../types/types"

const prebuildNodeDict = {
    "start": {
        name: "Start",
        icon: <IconPlayerPlay />,
        description: "This node signifies the start of execution for the file",
        immutableNode: true,
        
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

    sdmx_data_parser: {
        name: "SDMX Data Parser",
        icon: <IconBraces />,
        description: "This node parses SDMX files into a readable format",

        inputs: [
            {
                socketId: "version",
                socketName: "Version",
                selectableType: true,
                staticSocket: true,
                icon: <IconGitCompare />,
                type: {
                    groupId: "sdmx_version",
                    typeId: "sdmx_2_1"
                }
            },
            {
                socketId: "format",
                socketName: "Data Format",
                selectableType: true,
                staticSocket: true,
                icon: <IconBraces />,
                type: {
                    groupId: "sdmx_file",
                    typeId: "sdmx_xml"
                }
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
    }
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict