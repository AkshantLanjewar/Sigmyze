import { IconBraces, IconGitCompare, IconFileCode2, IconBrackets } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/node-instructions"

/**
 * the goal of this test is to validate that the SDMX Data Parser Node renders correctly
 * and that it integrates with the rest of the editors systems
 * 
 * Unit Test Requirements
 *  - title = SDMX Data Parser
 *  - there are 3 input blocks
 *  - the first input has name = Version
 *  - the second input has name = Data Format
 *  - the third input is a dynamic socket
 *      - the group title = SDMX XML Files
 *      - has 2 child inputs
 *      - the first child input name = Data
 *      - the second child input name = Schema
 *  - has 1 output block
 *  - first output name = Indicators
 * 
 * E2E Test Requirements
 *  - click on version button
 *  - version select menu opens
 *  - click on format button
 *  - format select menu opens
 *  - click on title
 *  - click on add button 
 *  - verify that add button are correct
 * 
 * Locators for the Tes
 *  - node-title -> this is the title container for the rendered node [added]
 *  - outputs -> this is the list of rendered outputs in the node [added]
 *  - output-{index} -> this is the container for a specific output based on its index in the rendered list [added]
 *  - output-type -> this is the type container for the output [added]
 *  - add-button -> this is the add new node button [added]
 *  - add-menu-items -> this is the container where the list of new nodes to be added are rendered [added]
 *  - inputs - this is the list of rendered inputs  [added]
 *  - input-{index} -> this is the container for a specific input based on its index in the list [added]
 *  - input-type -> this is the type container for the input [added]
 *  - input-type-menu -> this is the potential menu for a dynamic input type [added]
 *      - input-type-menu-open -> this is the button that opens the dynamic menu [added]
 *      - input-type-menu-target -> this is the target for the dropdown [added]
 *  - input-group-title -> if its a dynamic input, this is the group title [added]
 *  - input-group-children -> theese are the child nodes of a group [added]
 */

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