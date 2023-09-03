import { IconCloudUpload, IconEngine, IconPlus } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

/**
 * this test is to make sure the file upload node integrates with the editor, and with mocked store data
 * 
 * Dummy Data Format:
 *  - storeKey -> file_upload
 *  - ITEM_BEGIN
    *  - dummy-data object (store in frozenData)
    *      - name -> Dummy File
    *      - type -> groupId: files, typeId: xsd
    *      - icon -> <IconFileCode2 />
    *  - id -> v4()
    *  - addedKeys = ["name", "type", "icon"]
 *  - ITEM_END
 * 
 * Mount Test Requirements
 *  - title = File Upload
 *  - there is one input block
    *  - input 0 = Execution Thread
    *  - input 0 = hidden type
 *  - there is one output block
    *  - it is group with title = Files
    *  - it has 0 group children
 *  - there is one control button
 *  - control-0 = Add File
 * 
 * Mock Test Requirements
 *  - output-0 children = 1
 *  - children title = Dummy File
 * 
 * E2E Test Requirements
 *  - click on control-0
 *  - modal = New File
 *  - new-file-name = File Name
 *  - new-file-type = File Type
 *  - set file name to -> dummy_name
 *  - click create button on form
 *  - go to output-0
 *  - children = 1
 *  - child title = dummy_name
 * 
 * Locators for the Test
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
 *  - controls -> theese are the controls in the node [added]
 *  - control-{index} -> this is the indexed controll button [added]
 */

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
            groupId: "files",
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