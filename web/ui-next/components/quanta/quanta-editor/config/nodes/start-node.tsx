import { IconPlayerPlay, IconEngine } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/types";

/**
 * the goal of this unit test is to validate that the start-node renders
 * properly within the editor, and that it integrates with other components properly
 * 
 * Test requirements
 *  - mount test
 *      check that the node renderes with title = Start
 *      check that 1 output was created
 *      check that the name of the 0 index output = Execution Thread
 *      check that the output type is hidden
 *  - e2e test
 *      click the start node
 *      check that the add button has been rendered
 *      click the add button
 *      check that the add menu has been rendered
 *      check that only 1 node has been rendered in the menu list (based on the util function for add menu)
 * 
 * Locators for the Test
 *  - node-title -> this is the title container for the rendered node [added]
 *  - outputs -> this is the list of rendered outputs in the node [added]
 *  - output-{index} -> this is the container for a specific output based on its index in the rendered list [added]
 *  - output-type -> this is the type container for the output [added]
 *  - add-button -> this is the add new node button [added]
 *  - add-menu-items -> this is the container where the list of new nodes to be added are rendered [added]
 */

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