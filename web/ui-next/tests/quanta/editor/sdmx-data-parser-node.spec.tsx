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
const inputTypeMenuLocatorBase = "input-type-menu"
const inputGroupTitleLocator = "input-group-title"
const inputGroupChildrenLocator = "input-group-children"

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

//this is the unit test for the sdmx data parser node
test('sdmx data parser node mount', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("sdmx_data_parser")!
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

    //we want to test whether the title is valid
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("SDMX Data Parser")
    //now we want to check that there are 3 rendered input blocks
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(3)
    //we want to check the first input = Version
    const premierInputLocator = addExtensions(inputLocatorBase, ["0"])
    const premierInput = inputs.getByTestId(premierInputLocator)
    await expect(premierInput).toContainText("Version")
    //we want to check the second input = Data Format
    const secondInputLocator = addExtensions(inputLocatorBase, ["1"])
    const secondInput = inputs.getByTestId(secondInputLocator)
    await expect(secondInput).toContainText("Data Format")
    //now we want to check if the third input is a dynamic socket or not
    const thirdInputLocator = addExtensions(inputLocatorBase, ["2"])
    const thirdInput = inputs.getByTestId(thirdInputLocator)
    //we are checking if the group title matches up
    const thirdInputGroupTitle = thirdInput.getByTestId(inputGroupTitleLocator)
    await expect(thirdInputGroupTitle).toContainText("SDMX XML Files")
    //we are checking if the group has 2 child inputs
    const thirdInputGroupChildren = thirdInput.getByTestId(inputGroupChildrenLocator)
    await expect(thirdInputGroupChildren.locator('> div')).toHaveCount(2)
    //now we check the first child input = Data
    const firstChildInput = thirdInputGroupChildren.getByTestId(premierInputLocator + "::child")
    await expect(firstChildInput).toContainText("Data")
    //now we check the second child input = Schema
    const secondChildInput = thirdInputGroupChildren.getByTestId(secondInputLocator + "::child")
    await expect(secondChildInput).toContainText("Schema")
    //now we check that there are only 1 rendered output block
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //check that the only output block text = Indicators
    const outputBlockLocator = addExtensions(outputBase, ["0"])
    const outputBlock = outputs.getByTestId(outputBlockLocator)
    await expect(outputBlock).toContainText("Indicators")
})

test('E2E: sdmx data parser e2e integration test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("sdmx_data_parser")!
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

    //we want to get the version button 
    const versionLocator = addExtensions(inputLocatorBase, ["0"])
    const versionComponent = component.getByTestId(versionLocator)
    //now we want to get the button within the component
    const openButtonLocator = addExtensions(inputTypeMenuLocatorBase, ["open"])
    const version_openButton = versionComponent.getByTestId(openButtonLocator)
    await version_openButton.click()
    //now we want to check if the menu is visible or not
    const openMenuLocator = addExtensions(inputTypeMenuLocatorBase, ["target"])
    const version_openMenu = versionComponent.getByTestId(openMenuLocator)
    await expect(version_openMenu).toBeVisible()
    await version_openButton.click()
    //now we want to get the format button
    const formatLocator = addExtensions(inputLocatorBase, ["1"])
    const formatComponent = component.getByTestId(formatLocator)
    //now we want to get the button within the format component
    const format_openButton = formatComponent.getByTestId(openButtonLocator)
    await format_openButton.click()
    //now we want to check if the menu is visible or not
    const format_openMenu = formatComponent.getByTestId(openMenuLocator)
    await expect(format_openMenu).toBeVisible()
    await format_openButton.click()
    //now we will get the first output object
    const indicatorsOutputLocator = addExtensions(outputBase, ["0"])
    const indicatorsOutput = component.getByTestId(indicatorsOutputLocator)
    const indicatorsAddButton = indicatorsOutput.getByTestId(addButtonLocator)
    //now we will click the button and check how many menu items are inside
    await indicatorsAddButton.click()
    const addMenuItems = indicatorsOutput.getByTestId(addMenuItemsLocator)
    await expect(addMenuItems).toBeVisible()
    await expect(addMenuItems.locator('button')).toHaveCount(1)
})