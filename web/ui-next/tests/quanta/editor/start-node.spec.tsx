import { test, expect } from '@playwright/experimental-ct-react'
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { BuildNode, DetailedCreateList } from '../../../components/quanta/quanta-editor/utils'
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'

//here are the locators for the testing spec
const nodeTitleLocator = "node-title"
const outputLocator = "outputs"
const outputBase = "output"
const outputTypeLocator = "output-type"
const addButtonLocator = "add-button"
const addMenuItemsLocator = "add-menu-items"

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

//this is the unit test for the start node
test('start-node mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("start")!
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

    //test that the title has rendered for the node
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("Start")
    //we want to check that only 1 output was created
    const renderedOutputs = component.getByTestId(outputLocator)
    await expect(renderedOutputs).toHaveCount(1)
    //now we want to get the first output, at index 0
    const premierOutputLocator = addExtensions(outputBase, ["0"])
    const executionThreadOutput = component.getByTestId(premierOutputLocator)
    await expect(executionThreadOutput).toContainText("Execution Thread")
    //now we want to test whether or not the type is hidden
    const outputType = executionThreadOutput.getByTestId(outputTypeLocator)
    await expect(outputType).toBeEmpty()
})

//this is the e2e creation test for the start node
test('e2e: start-node integration test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("start")!
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

    //we want to first get the list of items for the thread menu
    let threadMenuItems = DetailedCreateList({ groupId: "base", typeId: "thread" }, "create")
    //we want to first click on the title to get the node's focus
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await nodeTitle.click()
    //check the add button is rendered and click it
    const addButton = component.getByTestId(addButtonLocator)
    await expect(addButton).toBeVisible()
    await addButton.click()
    //check if the menu is visible and contains the same amount of items as the threadMenuItems
    const addMenuItems = component.getByTestId(addMenuItemsLocator)
    await expect(addMenuItems).toBeVisible()
    await expect(addMenuItems).toHaveCount(threadMenuItems.length)
})