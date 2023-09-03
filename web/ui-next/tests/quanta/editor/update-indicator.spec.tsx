import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from "../../../components/ui/quanta-dataset-manager/types"
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { BuildNode } from '../../../components/quanta/quanta-editor/utils'
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'

//here are the locators for the testing spec
const nodeTitleLocator = "node-title"
const outputLocator = "outputs"
const inputsLocator = "inputs"
const inputLocatorBase = "input"

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

test('update-indicator mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("update_indicator")!
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

    //first we need to check the title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Update Indicator")
    //now we need to check that there are 3 input blocks
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(3)
    //now we need to check input-0 = Update Mode
    const updateModeLocator = addExtensions(inputLocatorBase, ["0"])
    const updateMode = inputs.getByTestId(updateModeLocator)
    await expect(updateMode).toContainText("Update Mode")
    //now we need to check input-1 = Chart Data
    const chartDataLocator = addExtensions(inputLocatorBase, ["1"])
    const chartData = inputs.getByTestId(chartDataLocator)
    await expect(chartData).toContainText("Chart Data")
    //now we need to check input-2 = Query Fields
    const queryFieldsLocator = addExtensions(inputLocatorBase, ["2"])
    const queryFields = inputs.getByTestId(queryFieldsLocator)
    await expect(queryFields).toContainText("Query Fields")
    //now we need to check that there are 0 output blocks
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(0)
})