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

test('get sdmx field key mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("get_sdmx_field_key")!
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

    //we need to first test whether or not the title of the node rendered correctly
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Get SDMX Field Key")
    //now we need to check that there is only 1 input block
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //now we need to check whether the input = SDMX Field
    const fieldInputLocator = addExtensions(inputLocatorBase, ["0"])
    const fieldInput = component.getByTestId(fieldInputLocator)
    await expect(fieldInput).toContainText("SDMX Field")
    //now we need to check that there is only 1 output block
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //now we need to check whether the output = Field Key
    const fieldKeyOutputLocator = addExtensions(outputBase, ["0"])
    const fieldKeyOutput = component.getByTestId(fieldKeyOutputLocator)
    await expect(fieldKeyOutput).toContainText("Field Key")
})

test('get sdmx field value mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("get_sdmx_field_value")!
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

    //we need to validate the title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Get SDMX Field Value")
    //now we need to check that there is only 1 input block
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //now we need to check whether the input = SDMX Field
    const fieldInputLocator = addExtensions(inputLocatorBase, ["0"])
    const fieldInput = component.getByTestId(fieldInputLocator)
    await expect(fieldInput).toContainText("SDMX Field")
    //now we need to check that there is only 1 output block
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //now we need to check whether the output = Field Key
    const fieldKeyOutputLocator = addExtensions(outputBase, ["0"])
    const fieldKeyOutput = component.getByTestId(fieldKeyOutputLocator)
    await expect(fieldKeyOutput).toContainText("Field Value")
})