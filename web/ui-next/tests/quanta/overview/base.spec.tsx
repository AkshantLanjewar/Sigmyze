import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'
import { ApplicationTestingWrapper, QuantaContextTestingWrapper } from '../../utils'
import QuantaOverviewView from '../../../components/quanta/overview/overview-view'
import SelectorViewModal from '../../../components/quanta/selector-view/modal'
import PublishModal from '../../../components/quanta/overview/publish-modal'

//here are the locators for the base testing spec
const previewButtonLocator = "preview-button"
const cancelButtonLocator = "cancel-preview"
const publishButtonLocator = "publish-button"
const formBuilderCancelLocator = "cancel-button"
const titleInputLocator = "publish-title-input"
const datasetIdInputLocator = "publish-dataset-id"
const datasetDescriptionInputLocator = "publish-dataset-description"
const datasetSegmentLocator = "publish-dataset-segment"

test('overview-view mount', async ({ mount }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: []
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <QuantaOverviewView testing={true} />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //we need to test for the preview button
    const previewButton = component.getByTestId(previewButtonLocator)
    await expect(previewButton).toContainText("Preview")
    //we need to test for the publish button
    const publishButton = component.getByTestId(publishButtonLocator)
    await expect(publishButton).toContainText("Publish")
})

test('selector-view mount', async ({ mount, page }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: []
    }

    let cancelClicked = false
    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <SelectorViewModal
                    opened={true}
                    close={() => { cancelClicked = true }}
                />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //we need to check to see modal mounted
    const cancelButton = page.getByTestId(cancelButtonLocator)
    await expect(cancelButton).toContainText("Cancel")
    //we now want to check the click functionality
    await cancelButton.click()
    await expect(cancelClicked).toBeTruthy()
})

test('publish modal mount test', async ({ mount, page }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: []
    }

    let cancelClicked = false
    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <PublishModal
                    opened={true}
                    close={() => { cancelClicked = true }}
                />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //validate title input
    const titleInput = page.getByTestId(titleInputLocator)
    await expect(titleInput).toContainText("Dataset Title")
    //validate dataset id input
    const datasetIdInput = page.getByTestId(datasetIdInputLocator)
    await expect(datasetIdInput).toContainText("Dataset ID")
    //validate dataset description
    const descriptionInput = page.getByTestId(datasetDescriptionInputLocator)
    await expect(descriptionInput).toContainText("Dataset Description")
    //validate dataset segment
    const formSegment = page.getByTestId(datasetSegmentLocator)
    await expect(formSegment).toContainText("Public")
    await expect(formSegment).toContainText("Local")
    //now we click the cancel button and validate the cancel clicked
    const cancelButton = page.getByTestId(formBuilderCancelLocator)
    await cancelButton.click()
    await expect(cancelClicked).toBeTruthy()
})

test('e2e: publish flow', async ({ mount, page }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: []
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <QuantaOverviewView testing={true} />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //click the publish button
    const publishButton = page.getByTestId(publishButtonLocator)
    await publishButton.click()
    
    const pageBody = page.locator("body")
    await expect(pageBody).toContainText("Publish")
})