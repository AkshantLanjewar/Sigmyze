import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { BuildNode, DetailedCreateList } from '../../../components/quanta/quanta-editor/utils'
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'
import { INodeExecutionResult } from '../../../components/quanta/quanta-editor/execution-engine/context/types'
import { IconStack2 } from '@tabler/icons'

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

test('sdmx-data-mapper node mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("sdmx_data_mapper")!
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

    //we need to check the title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("SDMX Data Mapper")
    //now we need to get the input blocks
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //we need to check the sdmx input block
    const sdmxInputLocator = addExtensions(inputLocatorBase, ["0"])
    const sdmxInput = inputs.getByTestId(sdmxInputLocator)
    await expect(sdmxInput).toContainText("SDMX Data")
    //now we need to check that there are only 2 output blocks
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(2)
    //we need to get the sdmx fields block and validate that it is infact dynamic
    const sdmxFieldLocator = addExtensions(outputBase, ["0"])
    const sdmxField = outputs.getByTestId(sdmxFieldLocator)
    //now we need to get the sdmx field group label
    const sdmxFieldGroupTitle = sdmxField.getByTestId(outputGroupTitleLocator)
    await expect(sdmxFieldGroupTitle).toContainText("SDMX Fields")
    //now we need to check that there are 0 group children
    const sdmxFieldGroupChildren = sdmxField.getByTestId(outputGroupChildrenLocator)
    await expect(sdmxFieldGroupChildren.locator('> div')).toHaveCount(0)
    //now we need to validate the chart data block
    const chartDataInputLocator = addExtensions(outputBase, ["1"])
    const chartDataInput = outputs.getByTestId(chartDataInputLocator)
    await expect(chartDataInput).toContainText("Chart Data")
})

test('sdmx-data-mapper node mock test', async ({ mount }) => {
    let mapperNode = BuildNode("sdmx_data_mapper")!
    //create the mock execution result
    let mockExecutionResult = {
        nodeId: mapperNode.data!.nodeId,
        fieldId: "sdmx_fields",
        rawData: JSON.stringify(["dummy1", "dummy2"]),
        computedSockets: [{
            type: { groupId: "base", typeId: "sdmx_field" },
            socketId: "demo",
            socketName: "Dummy Title",
            icon: <IconStack2 />
        }]
    } as INodeExecutionResult

    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [ mockExecutionResult ],
        nodes: [
            mapperNode
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

    //we need to get the sdmx fields block and validate that it is infact dynamic
    const sdmxFieldLocator = addExtensions(outputBase, ["0"])
    const outputs = component.getByTestId(outputLocator)
    const sdmxField = outputs.getByTestId(sdmxFieldLocator)
    //now we need to check that there are 0 group children
    const sdmxFieldGroupChildren = sdmxField.getByTestId(outputGroupChildrenLocator)
    await expect(sdmxFieldGroupChildren.locator('> div')).toHaveCount(1)
    //now we need to get the first child and check its title
    const dummySdmxField = sdmxFieldGroupChildren.getByTestId(sdmxFieldLocator + "::child")
    await expect(dummySdmxField).toContainText("Dummy Title")
})

test('E2E: sdmx-data-mapper integration test', async ({ mount, page }) => {
    //we want to first get the list of items for the related add buttons
    let fieldMenuItems = DetailedCreateList({ groupId: "base", typeId: "sdmx_field" }, "create")
    let chartMenuItems = DetailedCreateList({ groupId: "quanta", typeId: "chart_data" }, "create")

    let mapperNode = BuildNode("sdmx_data_mapper")!
    //create the mock execution result
    let mockExecutionResult = {
        nodeId: mapperNode.data!.nodeId,
        fieldId: "sdmx_fields",
        rawData: JSON.stringify(["dummy1", "dummy2"]),
        computedSockets: [{
            type: { groupId: "base", typeId: "sdmx_field" },
            socketId: "demo",
            socketName: "Dummy Title",
            icon: <IconStack2 />
        }]
    } as INodeExecutionResult

    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [ mockExecutionResult ],
        nodes: [
            mapperNode
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

    //we want to first click on the title to get the node's focus
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await nodeTitle.click()
    //we need to get the sdmx fields block and validate that it is infact dynamic
    const sdmxFieldLocator = addExtensions(outputBase, ["0"])
    const outputs = component.getByTestId(outputLocator)
    const sdmxField = outputs.getByTestId(sdmxFieldLocator)
    //now we need to get the first child and check its title
    const sdmxFieldGroupChildren = sdmxField.getByTestId(outputGroupChildrenLocator)
    const dummySdmxField = sdmxFieldGroupChildren.getByTestId(sdmxFieldLocator + "::child")
    await expect(dummySdmxField).toContainText("Dummy Title")
    //now we want to click the add button for the dummy sdmx field
    const field_addButton = dummySdmxField.getByTestId(addButtonLocator)
    await expect(field_addButton).toBeVisible()
    await field_addButton.click()
    //check if the menu is visible and contains the same amount of items as the field menu items
    const field_addMenuItems = dummySdmxField.getByTestId(addMenuItemsLocator)
    await expect(field_addMenuItems).toBeVisible()
    await expect(field_addMenuItems.locator('button')).toHaveCount(fieldMenuItems.length)
    //now we click back onto the title and wait
    await nodeTitle.click()
    await page.waitForTimeout(250)
    //now we need to validate the chart data block
    const chartDataInputLocator = addExtensions(outputBase, ["1"])
    const chartDataInput = outputs.getByTestId(chartDataInputLocator)
    //now we want to click the add button for the dummy chart data field
    const chart_addButton = chartDataInput.getByTestId(addButtonLocator)
    await expect(chart_addButton).toBeVisible()
    await chart_addButton.click()
    //check if the menu is visible and contains the same amount of items as the chart menu items
    const chart_addMenuItems = chartDataInput.getByTestId(addMenuItemsLocator)
    await expect(chart_addMenuItems).toBeVisible()
    await expect(chart_addMenuItems.locator('button')).toHaveCount(chartMenuItems.length)
})