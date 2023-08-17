import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from "../../../components/ui/quanta-dataset-manager/types"
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { v4 } from 'uuid'
import { BuildNode } from '../../../components/quanta/quanta-editor/utils'

//here are the locators for the testing spec
const groupLocator = "node-group"
const loaderLocator = "node-loader"
const deleteButtonLocator = "delete-icon"

const mockData: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    selectors: [],
    textStore: {},
    schemas: []
}

test('group mount test', async ({ mount, page }) => {
    const groupId = v4()
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            {
                id: groupId,
                type: 'quanta_group',
                position: { x: 150, y: 200 },
                data: {},
                style: {
                    width: 475,
                    height: 250
                },
            },
            BuildNode("iter", groupId)!
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

    //we need to test if the group is visible, and if it is, to click it to activate the action menu
    const nodeGroup = component.getByTestId(groupLocator)
    await expect(nodeGroup).toBeVisible()
    await nodeGroup.click()
    //we want to see if the group has become focused or not
    const deleteButton = component.getByTestId(deleteButtonLocator)
    await expect(deleteButton).toBeVisible()
    await page.waitForTimeout(1000 * 3)
    await deleteButton.click()
    //now we want to check if the page has confirm text or not
    await expect(page.locator("body")).toContainText("Are you Sure?")
})