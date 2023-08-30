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

test('apply-data-rule mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("apply_data_rule")!
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

    //test the title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Apply Data Rule")
    //we need to find the input blocks
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(3)
    //now we need to validate the rule input node
    const ruleInputLocator = addExtensions(inputLocatorBase, ["0"])
    const ruleInput = component.getByTestId(ruleInputLocator)
    await expect(ruleInput).toContainText("Rule")
    //now we need to validate the chart data input node
    const chartDataInputLocator = addExtensions(inputLocatorBase, ["1"])
    const chartDataInput = component.getByTestId(chartDataInputLocator)
    await expect(chartDataInput).toContainText("Chart Data")
    //now we need to validate that the data rule input block is infact dynamic
    const dataRuleInputLocator = addExtensions(inputLocatorBase, ["2"])
    const dataRuleInput = component.getByTestId(dataRuleInputLocator)
    const dataRuleInputTitle = dataRuleInput.getByTestId(inputGroupTitleLocator)
    await expect(dataRuleInputTitle).toContainText("Data Rule")
    //now we need to check that it only has one group child that is rendered
    const dataRuleInputChildren = dataRuleInput.getByTestId(inputGroupChildrenLocator)
    await expect(dataRuleInputChildren.locator('> div')).toHaveCount(1)
    //now we need to validate the last date socket
    const lastDataInput = dataRuleInputChildren.getByTestId(ruleInputLocator + "::child")
    await expect(lastDataInput).toContainText("Last Date Collected")
    //now we need to check that there is only one output block
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //now we need to check that the first and only output = Chart Data
    const chartDataOutputLocator = addExtensions(outputBase, ["0"])
    const chartDataOutput = component.getByTestId(chartDataOutputLocator)
    await expect(chartDataOutput).toContainText("Chart Data")
})