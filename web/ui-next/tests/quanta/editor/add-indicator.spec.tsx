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

test('add indicator mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("add_indicator")!
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

    //first we need to check the title = Add Indicator
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Add Indicator")
    //there are 2 input blocks
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(2)
    //we need to check input-0 = Chart Data
    const chartDataInputLocator = addExtensions(inputLocatorBase, ["0"])
    const chartDataInput = inputs.getByTestId(chartDataInputLocator)
    await expect(chartDataInput).toContainText("Chart Data")
    //we need to check input-1 = New Field
    const fieldInputLocator = addExtensions(inputLocatorBase, ["1"])
    const fieldInput = inputs.getByTestId(fieldInputLocator)
    await expect(fieldInput).toContainText("New Field")
    //now we need to check that there are 0 output blocks
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(0)
})