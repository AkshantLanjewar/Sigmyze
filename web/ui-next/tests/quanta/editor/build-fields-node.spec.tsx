import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { BuildNode } from '../../../components/quanta/quanta-editor/utils'
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'

//here are the locators for the testing spec
const nodeTitleLocator = "node-title"
const outputLocator = "outputs"
const outputBase = "output"
const addButtonLocator = "add-button"
const addMenuItemsLocator = "add-menu-items"
const inputsLocator = "inputs"
const inputLocatorBase = "input"
const outputGroupTitleLocator = "output-group-title"
const outputGroupChildrenLocator = "output-group-children"
const controlsLocators = "controls"
const controlLocatorBase = "control"
const inputGroupTitleLocator = "input-group-title"
const inputGroupChildrenLocator = "input-group-children"
const inputTypeLocator = "input-type"
//here are the locators for the forms
const newFileNameLocator = "new-file-name"
const newFileTypeLocator = "new-file-type"
const submitButtonLocator = "submit-button"
const cancelButtonLocator = "cancel-button"
//this is the locator for the build-fields form field
const fieldNameLocator = "field_name_input"

//utility function that add extensions to a locator
const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

const mockData: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    selectors: [],
    textStore: {},
    schemas: []
}

test('build fields mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("build_fields")!
        ],
    }

    const component = await mount(
        <div style={{ width: "100vw", height: "100vh" }}>
            <ApplicationTestingWrapper>
                <QuantaEditorTestingWrapper data={mockData} editorData={mockEditorData}>
                </QuantaEditorTestingWrapper>
            </ApplicationTestingWrapper>
        </div>
    )

    //test the node title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Build Fields")
    //now we need to check that there is one input block
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //now we need to check if the first input is dynamic and has title = Dataset Fields
    const schemaInputLocator = addExtensions(inputLocatorBase, ["0"])
    const schemaInput = component.getByTestId(schemaInputLocator)
    const schemaInputTitle = schemaInput.getByTestId(inputGroupTitleLocator)
    await expect(schemaInputTitle).toContainText("Dataset Fields")
    //now we need to check that there are no dynamic children within the input block
    const schemaInputChildren = schemaInput.getByTestId(inputGroupChildrenLocator)
    await expect(schemaInputChildren.locator('> div')).toHaveCount(0)
    //now we need to check that there is only 1 output block
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //now we need to check that output 0 = Field
    const fieldOutputLocator = addExtensions(outputBase, ["0"])
    const fieldOutput = outputs.getByTestId(fieldOutputLocator)
    await expect(fieldOutput).toContainText("Field")
    //now we need to check that there is only 1 control field
    const controls = component.getByTestId(controlsLocators)
    await expect(controls.locator('> div')).toHaveCount(1)
    //now we need to validate the control = Add Field
    const addFieldControlLocator = addExtensions(controlLocatorBase, ["0"])
    const addFieldControl = controls.getByTestId(addFieldControlLocator)
    await expect(addFieldControl).toContainText("Add Field")
})

const dumyMockData: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    selectors: [],
    textStore: {},
    schemas: [{
        schemaId: "dataset",
        schema: {
            children: [{
                nodeId: "dummy_id",
                quantaType: { groupId: "base", typeId: "string" },
                name: "Dummy Name"
            }]
        }
    }]
}

test('build fields dummy data test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("build_fields")!
        ],
    }

    const component = await mount(
        <div style={{ width: "100vw", height: "100vh" }}>
            <ApplicationTestingWrapper>
                <QuantaEditorTestingWrapper data={dumyMockData} editorData={mockEditorData}>
                </QuantaEditorTestingWrapper>
            </ApplicationTestingWrapper>
        </div>
    )

    //now we need to check that there is one input block
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //now we need to check if the first input is dynamic and has title = Dataset Fields
    const schemaInputLocator = addExtensions(inputLocatorBase, ["0"])
    const schemaInput = component.getByTestId(schemaInputLocator)
    const schemaInputTitle = schemaInput.getByTestId(inputGroupTitleLocator)
    await expect(schemaInputTitle).toContainText("Dataset Fields")
    //now we need to check that there is one dynamic child within the input block
    const schemaInputChildren = schemaInput.getByTestId(inputGroupChildrenLocator)
    await expect(schemaInputChildren.locator('> div')).toHaveCount(1)
    //now we need to get the child and validate = Dummy Name
    const dummyInputLocator = schemaInputLocator + "::child"
    const dummyInput = component.getByTestId(dummyInputLocator)
    await expect(dummyInput).toContainText("Dummy Name")
})

test('E2E: Build Fields integration test', async ({ mount, page }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("build_fields")!
        ],
    }

    const component = await mount(
        <div style={{ width: "100vw", height: "100vh" }}>
            <ApplicationTestingWrapper>
                <QuantaEditorTestingWrapper data={mockData} editorData={mockEditorData}>
                </QuantaEditorTestingWrapper>
            </ApplicationTestingWrapper>
        </div>
    )

    //now we need to check that there is only 1 control field
    const controls = component.getByTestId(controlsLocators)
    await expect(controls.locator('> div')).toHaveCount(1)
    //now we need to validate the control = Add Field
    const addFieldControlLocator = addExtensions(controlLocatorBase, ["0"])
    const addFieldControl = controls.getByTestId(addFieldControlLocator)
    await expect(addFieldControl).toContainText("Add Field")
    //click the control
    await addFieldControl.click()
    //now we need to validate the form = Field Name
    const fieldNameInput = page.getByTestId(fieldNameLocator)
    await expect(fieldNameInput).toContainText("Field Name")
    //now we need to type in the name of a dummy field
    const fieldNameInputRaw = fieldNameInput.locator('input').first()
    await fieldNameInputRaw.type("Dummy Name", { delay: 200 })
    //now we need to submit the form
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()
    //now we need to check that there is one input block
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //now we need to check if the first input is dynamic and has title = Dataset Fields
    const schemaInputLocator = addExtensions(inputLocatorBase, ["0"])
    const schemaInput = component.getByTestId(schemaInputLocator)
    const schemaInputTitle = schemaInput.getByTestId(inputGroupTitleLocator)
    await expect(schemaInputTitle).toContainText("Dataset Fields")
    //now we need to check that there is one dynamic child within the input block
    const schemaInputChildren = schemaInput.getByTestId(inputGroupChildrenLocator)
    await expect(schemaInputChildren.locator('> div')).toHaveCount(1)
    //now we need to get the child and validate = Dummy Name
    const dummyInputLocator = schemaInputLocator + "::child"
    const dummyInput = component.getByTestId(dummyInputLocator)
    await expect(dummyInput).toContainText("Dummy Name")
})