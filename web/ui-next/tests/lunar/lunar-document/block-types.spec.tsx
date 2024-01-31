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

/**
 * This is the locator for the select chart flow wrapper
 * testValue is the flow's step
 */
const selectChartFlowLocator = "select-chart-flow"

/**
 * this is the locator for the chart select stage
 */
const chartSelectStageLocator = "chart-select-stage"

/**
 * This is the wrapper for the chart options in the select stage
 */
const chartOptionsLocator = "chart-options"

/**
 * This is the base for a chart option within the select stage
 */
const chartOptionBase = "chart-option"

/**
 * This is the locator for the chart preview in the select stage
 */
const chartPreviewLocator = "chart-preview"

/**
 * This is the locator for the cancel button in the select stage
 */
const chartSelectCancelLocator = "select-cancel"

/**
 * This is the locator for the continue button in the select stage
 */
const chartSelectContinueLocator = "select-continue"

/**
 * This is the locator for the settings stage 
 */
const chartSettingsStageLocator = "chart-settings-stage"

/**
 * This is the locator for the display title switch in the settings stage
 */
const chartSettingsTitleSwitchLocator = "display-title-switch"

/**
 * this is the locator for the chart title input
 */
const chartTitleLocator = "chart-title"

/**
 * This is the locator for the display x axis switch
 */
const displayXAxisLocator = "display-x-axis"

/**
 * this is the locator for the invert y axis switch
 */
const invertYAxisLocator = "invert-y-axis"

/**
 * This is the locator for the show y axis switch
 */
const showYAxisLocator = "show-y-axis"

/**
 * This is the locator for the cancel button in the settings stage
 */
const settingsCancelLocator = "settings-cancel"

/**
 * This is the locator for the submit button in the settings modal
 */
const settingsSubmitLocator = "settings-submit"

/**
 * This is the locator for the chart block
 */
const chartBlockBodyLocator = "chart-block-body"

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
    for(let i = 0; i < order; i++)
        await page.keyboard.press("#")

    //type in !#
    
    await page.keyboard.press("Space")

    //form the heading string and check the blocks value is equiv
    let headingValue = `heading::${order}`
    await expect(block).toHaveAttribute('data-testValue', headingValue)
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

    //type in @#
    await page.keyboard.type(`@#`, { delay: 200 })

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
    const imageUploadBTN = uploadImageModal.getByTestId('upload-image-btn')

    //run the action
    await imageUploadBTN.click()
    await imageUploadRAW.setInputFiles("./public/screenshots/drive-ss.png")

    //check the submit button is not disabled
    await expect(submitButton).not.toBeDisabled()
    await submitButton.click()

    //check that the testValue is media::image
    await expect(block).toHaveAttribute('data-testValue', "media::image")

    //check that there is an image in the block content
    const blockContentImage = block.getByTestId('image-body')
    await expect(blockContentImage).toBeAttached()
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

    //type in @$
    await page.keyboard.type(`@$`, { delay: 200 })

    //check the select chart flow is attached and value = [select] | settings
    const selectChartFlow = page.getByTestId(selectChartFlowLocator)
    await expect(selectChartFlow).toBeAttached()
    await expect(selectChartFlow).toHaveAttribute("data-testValue", "select")

    //make sure the chart select stage is attached
    const chartSelectStage = selectChartFlow.getByTestId(chartSelectStageLocator)
    await expect(chartSelectStage).toBeAttached()

    //make sure chart options has 1 child
    const chartOptions = chartSelectStage.getByTestId(chartOptionsLocator)
    await expect(chartOptions.locator('> div')).toHaveCount(1)

    //make sure chart preview is not attached
    const chartPreview = chartSelectStage.getByTestId(chartPreviewLocator)
    await expect(chartPreview).not.toBeAttached()

    //get chart-option-0 and click it
    const chartOptionLocator = addExtensions(chartOptionBase, ["0"])
    const chartOption = chartOptions.getByTestId(chartOptionLocator)
    await expect(chartOption).toBeAttached()
    await chartOption.click()

    //make sure chart preview is attached
    await expect(chartPreview).toBeAttached()

    //make sure select cancel is attached
    const selectCancel = chartSelectStage.getByTestId(chartSelectCancelLocator)
    await expect(selectCancel).toBeAttached()

    //make sure select continue is attached
    const selectContinue = chartSelectStage.getByTestId(chartSelectContinueLocator)
    await expect(selectContinue).toBeAttached()
    await selectContinue.click()

    //check chart flow value = [settings]
    await expect(selectChartFlow).toHaveAttribute("data-testValue", "settings")

    //make sure the settings stage is attached
    const chartSettingsStage = selectChartFlow.getByTestId(chartSettingsStageLocator)
    await expect(chartSettingsStage).toBeAttached()

    //make sure the title switch is attached
    const titleSwitch = chartSettingsStage.getByTestId(chartSettingsTitleSwitchLocator)
    await expect(titleSwitch).toBeAttached()

    //check that the display x axis is attached
    const displayXAxis = chartSettingsStage.getByTestId(displayXAxisLocator)
    await expect(displayXAxis).toBeAttached()

    //check that the invert y axis is attached
    const invertYAxis = chartSettingsStage.getByTestId(invertYAxisLocator)
    await expect(invertYAxis).toBeAttached()

    //check that the show y axis is attached
    const showYAxis = chartSettingsStage.getByTestId(showYAxisLocator)
    await expect(showYAxis).toBeAttached()

    //check the cancel button is attached
    const settingsCancel = chartSettingsStage.getByTestId(settingsCancelLocator)
    await expect(settingsCancel).toBeAttached()

    //click the submit button
    const settingsSubmit = chartSettingsStage.getByTestId(settingsSubmitLocator)
    await settingsSubmit.click()

    //check that block has block body
    const chartBlockBody = block.getByTestId(chartBlockBodyLocator)
    await expect(chartBlockBody).toBeAttached()
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