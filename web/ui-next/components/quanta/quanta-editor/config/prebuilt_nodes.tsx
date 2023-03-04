import { IconPlayerPlay, IconEngine, IconCloudUpload, IconPlus, IconBraces, IconGitCompare, IconFileCode2, IconBrackets, IconRepeat, IconMapSearch, IconDatabaseImport } from "@tabler/icons"
import { v4 } from "uuid"
import { IQuantaNodeInstructions } from "../types/types"

const prebuildNodeDict = {
    start: {
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

    iter: {
        name: "Iterate",
        icon: <IconRepeat />,
        description: "This node iterates over an array",
        immutableNode: true
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
            },
            {
                dynamicSocket: true,
                groupTitle: "SDMX XML Files",
                dynamicDepend: "input_val",
                inputId: "format",
                dependentInputs: [
                    {
                        inputValue: "sdmx_xml",
                        sockets: [
                            {
                                socketId: "data_file",
                                socketName: "Data",
                                icon: <IconFileCode2 />,
                                type: {
                                    groupId: "files",
                                    typeId: "xml"
                                }
                            },
                            {
                                socketId: "schema_file",
                                socketName: "Schema",
                                icon: <IconFileCode2 />,
                                type: {
                                    groupId: "files",
                                    typeId: "xsd"
                                }
                            }
                        ]
                    }
                ]
            }
        ],

        outputs: [
            {
                socketId: "sdmx_indicators",
                socketName: "Indicators",
                icon: <IconBrackets />,
                isArray: true,
                type: {
                    groupId: "base",
                    typeId: "array"
                },
                arrayType: {
                    groupId: "base",
                    typeId: "sdmx_indicator"
                }
            }
        ]
    },

    sdmx_data_mapper: {
        name: "SDMX Data Mapper",
        icon: <IconMapSearch />,
        description: "This node exposes the fields within an SDMX indicator",

        inputs: [
            {
                socketId: "sdmx_data",
                socketName: "SDMX Data",
                icon: <IconDatabaseImport />,
                type: {
                    groupId: "base",
                    typeId: "sdmx_indicator"
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
    },
} as { [key: string]: IQuantaNodeInstructions }

export default prebuildNodeDict