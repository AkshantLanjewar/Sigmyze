import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import { Locator, Page } from "@playwright/test"
import LunarRefresh from '../../../components/lunar-refresh/page';
import { addIndicatorChartRenderTEST } from '../lunar-chart/quanta-data.spec';

import { 
    addRefreshChartCancelLocator,
    addRefreshChartLocator,
    addRefreshChartOptionBase,
    addRefreshChartOptionsLocator,
    addRefreshChartSubmitLocator,
    blockContentLocator, 
    blockDragHandleLocator, 
    documentBlockBase, 
    documentContainerLocator, 
    sizeHandlesLocator, 
    uploadImageInputLocator, 
    uploadImageModalCancelLocator, 
    uploadImageModalLocator, 
    uploadImageModalSubmitLocator 
} from './locators'

import { 
    quantaPublicPublishedDatasetsROUTE, 
    quantaPrimeDatasetROUTE, 
    quantaSelectIndicatorLengthROUTE, 
    quantaSelectPagedIndicatorsROUTE, 
    quantaSelectIndicator 
} from '../lunar-chart/mock-api';

interface MountResult extends Locator {
    unmount(): Promise<void>;
    update(component: JSX.Element): Promise<void>;
}

//specific button that is within the portal. (note this is a base, and needs to be combined with an index)
const buttonPortalButtonBase = "button"

/**
 * this is the button that activates the new note form
 */
const newNoteButtonLocator = "new-note"

/**
 * this is the locator for the note name input in the note-create form
 */
const noteNameInputLocator = "note-name"

/**
 * this is the locator for the submit button in all generated forms
 */
const submitButtonLocator = "submit-button"

const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

const createDocumentPage = async (component: MountResult, page: Page) => {
    //create a chart so that we can add it into the document
    await addIndicatorChartRenderTEST(component, page)

    //click the root folder
    const containerFolderZeroLocator = addExtensions("container-folder", ["0"])
    const containerFolderZero = component.getByTestId(containerFolderZeroLocator).locator('> button')
    await containerFolderZero.click()

    //get the toolbar create button and click it
    const toolbarCreateButtonLocator = addExtensions(buttonPortalButtonBase, ["0"])
    const toolbarCreateButton = component.getByTestId(toolbarCreateButtonLocator)
    await toolbarCreateButton.click()

    //get the new note button and activate the new note form
    const newNoteButton = component.getByTestId(newNoteButtonLocator)
    await newNoteButton.click()

    //type in a dummy name for the new note
    const noteNameInput = page.getByTestId(noteNameInputLocator)
    const noteNameInputRAW = noteNameInput.locator('input')
    await noteNameInputRAW.type('dummy note', { delay: 200 })

    //now we need to get the submit button and click it
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we validate that the document-container is attached
    const documentContainer = component.getByTestId(documentContainerLocator)
    await expect(documentContainer).toBeAttached()
    await expect(documentContainer.locator('> div')).toHaveCount(1)
}

const blockTitleIMPL = async (order: number, component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to a heading
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //we want to construct the order string
    let orderString = ""
    for(let i = 0; i < order; i++)
        orderString += "#"

    //type in !#
    await page.keyboard.type(`!${orderString}`, { delay: 200 })
    await page.keyboard.press("Spacebar")

    //form the heading string and check the blocks value is equiv
    let headingValue = `heading::${order}`
    await expect(block).toHaveAttribute('data-testValue', headingValue)

    //check the element is attached
    let elementLocator = `h${order}`
    const element = blockContent.locator(elementLocator)
    await expect(element).toBeAttached()
}

const paragraphIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content to validate its a paragraph
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //check that the element is attached
    const element = blockContent.locator("p")
    await expect(element).toBeAttached()

    //check the grabhandles are attached
    const grabHandles = block.getByTestId(blockDragHandleLocator)
    await expect(grabHandles).toBeAttached()
}

const imageIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to an image
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in !^^
    await page.keyboard.type(`!^^`, { delay: 200 })
    await page.keyboard.press("Spacebar")

    //check the upload image modal is attached
    const uploadImageModal = page.getByTestId(uploadImageModalLocator)
    await expect(uploadImageModal).toBeAttached()

    //get the submit button and check if it is disabled
    const submitButton = page.getByTestId(uploadImageModalSubmitLocator)
    await expect(submitButton).toBeDisabled()

    //check that there is a cancel button attached
    const cancelButton = page.getByTestId(uploadImageModalCancelLocator)
    await expect(cancelButton).toBeAttached()

    //get the input and upload the image file
    const imageUpload = page.getByTestId(uploadImageInputLocator)
    const imageUploadRAW = imageUpload.locator('input')

    //run the action
    await imageUploadRAW.click()
    await imageUploadRAW.setInputFiles("./public/screenshots/drive-ss.png")

    //check the submit button is not disabled
    await expect(submitButton).not.toBeDisabled()
    await submitButton.click()

    //check that the testValue is media::image
    await expect(block).toHaveAttribute('data-testValue', "media::image")

    //check that there is an image in the block content
    const blockContentImage = blockContent.locator("image")
    await expect(blockContentImage).toBeAttached()

    //check the size handles are attached
    const sizeHandles = block.getByTestId(sizeHandlesLocator)
    await expect(sizeHandles).toBeAttached()
}

const chartIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to a chart
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in !$$
    await page.keyboard.type(`!$$`, { delay: 200 })
    await page.keyboard.press("Spacebar")

    //check the refresh chart modal is attached
    const addRefreshChart = page.getByTestId(addRefreshChartLocator)
    await expect(addRefreshChart).toBeAttached()

    //check there is a cancel button attached
    const cancelButton = page.getByTestId(addRefreshChartCancelLocator)
    await expect(cancelButton).toBeAttached()

    //check the submit button is disabled
    const submitButton = page.getByTestId(addRefreshChartSubmitLocator)
    await expect(submitButton).toBeDisabled()

    //check that refresh chart options has 1 child
    const refreshChartOptions = addRefreshChart.getByTestId(addRefreshChartOptionsLocator)
    await expect(refreshChartOptions.locator('> div')).toHaveCount(1)

    //check that refresh-chart-0 has title swag
    const refreshChartLocator = addExtensions(addRefreshChartOptionBase, ["0"])
    const refresHChart = refreshChartOptions.getByTestId(refreshChartLocator)
    await expect(refresHChart).toContainText("swag")

    //click on the chart and the submit button also now works
    await refresHChart.click()
    await expect(submitButton).not.toBeDisabled()
    await submitButton.click()

    //check that the testValue is media::image
    await expect(block).toHaveAttribute('data-testValue', "media::chart")

    //check the size handles are attached
    const sizeHandles = block.getByTestId(sizeHandlesLocator)
    await expect(sizeHandles).toBeAttached()
}


/**
 * First we are going to loop 1-6 to test the heading orders
 */
for(let i = 0; i < 6; i++) {
    let order = i + 1
    let testTitle = `[Lunar Document]: Title Heading Test (Order ${order})`

    test(testTitle, async({ mount, page }) => {
        //set up th emocked routes before the mount
        await quantaPublicPublishedDatasetsROUTE(page)
        await quantaPrimeDatasetROUTE(page)
        await quantaSelectIndicatorLengthROUTE(page)
        await quantaSelectPagedIndicatorsROUTE(page)
        await quantaSelectIndicator(page)

        const component = await mount (
            <MemoryRouterProvider url={'/lunar'}>
                <LunarRefresh defaultDebugMode={true} />
            </MemoryRouterProvider>
        )

        await blockTitleIMPL(order, component, page)
    })
}

test('[Lunar Document]: Paragraph Block Test', async({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)
    await quantaSelectIndicator(page)

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true} />
        </MemoryRouterProvider>
    )

    await paragraphIMPL(component, page)
})

test('[Lunar Document]: Image Block Test', async({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)
    await quantaSelectIndicator(page)

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true} />
        </MemoryRouterProvider>
    )

    await imageIMPL(component, page)
})

test('[Lunar Document]: Chart Block Test', async({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)
    await quantaSelectIndicator(page)

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true} />
        </MemoryRouterProvider>
    )

    await chartIMPL(component, page)
})

export { 
    createDocumentPage,
    imageIMPL,
    chartIMPL 
}