import { test, expect } from '@playwright/experimental-ct-react'
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { BuildNode } from '../../../components/quanta/quanta-editor/utils'
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'

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

test('string to date mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("string_to_date")!
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

    //first we want to test the title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("String to Date")
    //now we need to check that there is one input block
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //now we need to check input 0 = Input String
    const inputStringLocator = addExtensions(inputLocatorBase, ["0"])
    const inputString = component.getByTestId(inputStringLocator)
    await expect(inputString).toContainText("Input String")
    //now we need to check that there is one output block
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //now we need to check output-0 = Date
    const dateOutputLocator = addExtensions(outputBase, ["0"])
    const dateOutput = component.getByTestId(dateOutputLocator)
    await expect(dateOutput).toContainText("Date")
})