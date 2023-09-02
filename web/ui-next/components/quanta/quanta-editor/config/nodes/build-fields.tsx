import { IconDatabaseImport, IconHammer, IconPlus } from "@tabler/icons";
import { IQuantaNodeInstructions } from "../../types/node-instructions";

/**
 * here are the testing requirements for the BuildField node to make sure it integrates into the editor
 * 
 * Additional Locators
 *  - field_name_input -> this is the input for the field_name field in the control form
 * 
 * Mount Test
 *  - title = Build Fields
 *  - there is one input block
 *  - the input is dynamic and the title = Dataset Fields
 *  - there are no dynamic children
 *  - there is one output block
 *  - output 0 = Field
 *  - there are 1 control field
 *  - control 0 = Add Field
 * 
 * Dummy Data Data
 *  - datasetId: dataset (parent object)
 *  - nodeId: dummyId
 *  - quantaType: { groupId: "base", typeId: "string" }
 *  - name: Dummy Name
 * 
 * Dummy Data Test
 *  - since this node relies on dynamic data stored in the dataset indicator, we will be conducting a dummy data test as well
 *  - there is one child input block in the dynamic input block
 *  - title = Dummy Name
 * 
 * E2E Test:
 *  - click on control 0
 *  - validate form -> Field Name
 *  - type Dummy Name into form field
 *  - submit form
 *  - validate there is one dynamic input child with name = Dummy Name
 */

const BuildField = {
    name: "Build Fields",
    icon: <IconHammer />,
    description: "Creates the field value for the indicator",

    inputs: [
        {
            dynamicSocket: true,
            groupTitle: "Dataset Fields",
            dynamicDepend: "quanta",
            quantaDepend: "schema"
        }
    ],

    outputs: [
        {
            socketId: "field",
            socketName: "Field",
            icon: <IconDatabaseImport />,
            type: {
                groupId: "quanta",
                typeId: "field"
            }
        }
    ],

    controls: [
        {
            activates: "quanta",
            quantaActivation: "new_field",
            id: "create_field_control",
            name: "Add Field",
            icon: <IconPlus />
        }
    ]
} as IQuantaNodeInstructions

export { BuildField }