import { IconBraces, IconGitCompare, IconFileCode2, IconBrackets } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/node-instructions"

const SDMXDataParser = {
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
} as IQuantaNodeInstructions

export { SDMXDataParser }