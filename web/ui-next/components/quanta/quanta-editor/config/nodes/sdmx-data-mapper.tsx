import { IconMapSearch, IconDatabaseImport, IconChartAreaLine } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

/**
 * the goal of this test is to validate that the sdmx data mapper works and integrates into the editor
 * as well as test the result mock execution results has on the node
 * 
 * Dummy Data Format
 *  field_id = sdmx_fields
 *  node_id = test_node_id
 *  computed_sockets
 *      - type = { groupId: "base", typeId: "sdmx_field" }
 *      - socketId = demo
 *      - socketName = Dummy Title
 *      - icon = <IconStack2 />
 * 
 * Mount Unit Test Requirements
 *  - title = SDMX Data Mapper
 *  - there is one input block
 *      - the only input name = SDMX Data
 *  - there are 2 output blocks
 *      - the first output block should be dynamic
 *      - the grouptitle = SDMX Fields
 *      - the gorupChildren = 0
 *      - the second output block = Chart Data
 * 
 * Mock Data Unit Test Requirements
 *  - check first output block
 *  - children should now be 1
 *  - children title = Dummy Title
 * 
 * E2E Testing Requirements
 *  - click on node title
 *  - click on dummy sdmx field add button
 *  - check output items
 *  - click on node title
 *  - click on chart_data add button
 *  - check output items
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

const SDMXDataMapper = {
    name: "SDMX Data Mapper",
    icon: <IconMapSearch />,
    description: "This node exposes the fields within an SDMX indicator",
    cacheable: true,

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
    ],

    outputs: [
        {
            dynamicSocket: true,
            dynamicDepend: "execution",
            groupTitle: "SDMX Fields",
            executionField: "sdmx_fields"
        },
        {
            socketId: "chart_data",
            socketName: "Chart Data",
            icon: <IconChartAreaLine />,
            type: {
                groupId: "quanta",
                typeId: "chart_data"
            }
        }
    ]
} as IQuantaNodeInstructions

export { SDMXDataMapper }