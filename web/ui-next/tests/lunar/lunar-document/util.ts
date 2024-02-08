import { expect, Locator, Page } from "@playwright/test"
import { blockContentLocator, documentBlockBase, documentContainerLocator, uploadImageInputLocator, uploadImageModalCancelLocator, uploadImageModalLocator, uploadImageModalSubmitLocator } from "./locators"

const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

interface MountResult extends Locator {
    unmount(): Promise<void>;
    update(component: JSX.Element): Promise<void>;
}

//here are all the locators for the tests

//specific button that is within the portal. (note this is a base, and needs to be combined with an index)
const buttonPortalButtonBase = "button"
//this is the button that opens the new chart modal
const newChartLocator = "new-chart"
//this is the wrapper for the datasets during the indicator selection flow
const addIndicatorDatasetsLocator = "add-i-datasets-wrapper"
//this is the continue button during the dataset-selection portion
const datasetContinueLocator = "dataset-continue"
//this is the cacnel button during the dataset-selection portion
const datasetCancelLocator = "dataset-cancel"
//this is the base for a dataset within the add indicator flow
const datasetBase = "dataset"
//this is the locator for all the frames within the indicator flow
const indicatorRendererFramesLocator = "renderer-frames"
//this is the base for an iframe that is rendered
const iframeBase = "iframe"
//this is the locator for the categories within the indicator-category selector
const categoriesLocator = "categories"
//this is the base for a category within the indicator-category selector
const categoryBase = "category"
//this is the locator for the indicator-cards wrapper in the category selector
const indicatorCardsWrapperLocator = "indicator-cards"
//this is the base for an indicator card
const indicatorCardBase = "indicator-card"
//this is the previous button the indicator card
const addIndicatorPreviousLocator = "indicator-previous"
//add indicator button
const addIndicatorButtonLocator = "add-indicator"
//this is where all the lines are rendered in the chart
const lineRendererLocator = "line-renderer"
//this is the container for all the legend elements
const legendContainerLocator = "legend"
//this is the base for a legend item
const legendBase = "legend-item"
//indicator flow container
const addIndicatorFlowContainerLocator = "add-indicator-flow-container"

/**
 * this is the locator for the chart name input in the chart-create form
 */
const chartNameInputLocator = "chart-name"

/**
 * this is the locator for the submit button in all generated forms
 */
const submitButtonLocator = "submit-button"

/**
 * this is the base to find indexed folders within the file tree viewer
 * it is used in the format container-folder-[x], where x is the index
 */
const containerFolderBase = "container-folder"
/**
 * this is the base used to find indexed files within the file tree viewer
 * it is used in the format container-element-[x], where x is the index
 */
const containerElementBase = "container-element"

/**
 * this is the container where all of a folder's children are stored
 */
const folderChildrenLocator = "folder-children"

/**
 * This is the container where all of an element's children are stored
 */
const elementChildrenLocator = "element-children"

/**
 * this is the locator for the tabs container in the viewport
 */
const viewportTabsLocator = "viewport-tabs"

/**
 * this is the locator for a viewport tab within the viewport tabs container
 */
const viewportTabBase = "viewport-tab"

/**
 * this is the locator for the close button within a tab
 */
const closeTabLocator = "close-tab"

//here are all the tests for the spec

//here are testing steps bundled as functions for easier use

//TEST PASSED
const openAddIndicatorModalTEST = async (component: MountResult, page: Page) => {
    //first we want to get the toolbar create button (button-0)
    const toolbarCreateButtonLocator = addExtensions(buttonPortalButtonBase, ["0"])
    const toolbarCreateButton = component.getByTestId(toolbarCreateButtonLocator)
    await toolbarCreateButton.click()

    //then we want to get the new chart button and click it
    const newChartButton = component.getByTestId(newChartLocator)
    await newChartButton.click()

    //then we want to validate chart-name = New Chart Name
    const chartNameInput = page.getByTestId(chartNameInputLocator)
    await expect(chartNameInput).toContainText("New Chart Name")

    //now we want to get the raw input so we can type some text
    const chartNameInputRaw = chartNameInput.locator('input')
    await chartNameInputRaw.type("swag", { delay: 200 })

    //now we need to get the submit button and click it
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we need to get the add-indicator button from the toolbar
    const addIndicatorButtonLocator = addExtensions(buttonPortalButtonBase, ["0"])
    const addIndicatorButton = component.getByTestId(addIndicatorButtonLocator)
    await addIndicatorButton.click()

    //now we need to validate that the modal is in the dataset stage
    const addIndicatorFlowContainer = page.getByTestId(addIndicatorFlowContainerLocator)
    await expect(addIndicatorFlowContainer).toHaveAttribute("data-stage", "dataset")
}

const addIndicatorDatasetPaneTEST = async (component: MountResult, page: Page) => {
    //call the previous stage
    await openAddIndicatorModalTEST(component, page)

    //now we need to validate that there are 2 datasets that are returned
    const addIndicatorFlowContainer = page.getByTestId(addIndicatorFlowContainerLocator)
    const datasetsContainer = addIndicatorFlowContainer.getByTestId(addIndicatorDatasetsLocator)
    await expect(datasetsContainer.locator('> div')).toHaveCount(2)

    //now we need to get the first dataset card and check the title = dummy-dataset
    const dummyDatasetCardLocator = addExtensions(datasetBase, ["0"])
    const dummyDatasetCard = datasetsContainer.getByTestId(dummyDatasetCardLocator)
    await expect(dummyDatasetCard).toContainText("dummy-dataset")

    //check that there is a cancel button
    const datasetCancelButton = page.getByTestId(datasetCancelLocator)
    await expect(datasetCancelButton).toBeAttached()

    //check that the continue button is disabled
    const datasetContinueButton = page.getByTestId(datasetContinueLocator)
    await expect(datasetContinueButton).toBeDisabled()

    //now click on the dummy dataset card
    await dummyDatasetCard.click()

    //now the continue button should not be disabled
    await expect(datasetContinueButton).not.toBeDisabled()
}

const addIndicatorSelectorPaneTEST = async (component: MountResult, page: Page) => {
    //call the previous step
    await addIndicatorDatasetPaneTEST(component, page)

    //get the continue button and click it
    const datasetContinueButton = page.getByTestId(datasetContinueLocator)
    await datasetContinueButton.click() 

    //check there is one child attached to the iframeRenderer
    const indicatorRendererFrames = page.getByTestId(indicatorRendererFramesLocator)
    await expect(indicatorRendererFrames.locator('> div')).toHaveCount(1)

    //now we have to get the iframe from the rendererFrames
    const countrySelectorLocator = addExtensions(iframeBase, ["0"])
    const countrySelector = indicatorRendererFrames.getByTestId(countrySelectorLocator)
    const countrySelectorIFrame = countrySelector.locator('iFrame')
    await expect(countrySelectorIFrame).toBeAttached()

    //now we have to check there is an element with an id = country-USA
    const countrySelectorFrameLocator = countrySelectorIFrame.frameLocator(":scope")
    const countrySelectorUSA = countrySelectorFrameLocator.locator("#country-MEX")
    await expect(countrySelectorUSA).toBeAttached()

    //now click on the USA country and 2 frames should be attached
    await countrySelectorUSA.click()
    await expect(indicatorRendererFrames.locator('> div')).toHaveCount(2)

    //now we have to get the iframe for the category selector
    const categorySelectorLocator = addExtensions(iframeBase, ["1"])
    const categorySelector = indicatorRendererFrames.getByTestId(categorySelectorLocator)
    const categorySelectorIFrame = categorySelector.locator('iFrame')
    await expect(categorySelectorIFrame).toBeAttached()

    //now we have to check there is an element with a testId's of categories
    const categorySelectorFrameLocator = categorySelectorIFrame.frameLocator(":scope")
    const selectorCategoriesContainer = categorySelectorFrameLocator.getByTestId(categoriesLocator)
    await expect(selectorCategoriesContainer).toBeAttached()

    //categories has category-gdp
    const gdpCategoryLocator = addExtensions(categoryBase, ["gdp"])
    const gdpCategory = selectorCategoriesContainer.getByTestId(gdpCategoryLocator)
    await expect(gdpCategory).toBeAttached()

    //click on gdp category
    await gdpCategory.click()

    //get the indicator cards wrapper and check it has 20 children
    const indicatorCardsWrapper = categorySelectorFrameLocator.getByTestId(indicatorCardsWrapperLocator)
    await expect(indicatorCardsWrapper.locator('> div')).toHaveCount(20)

    //validate indicator-card-0 has text Qatar and Gross domestic product corresponding
    const indicatorCardLocator = addExtensions(indicatorCardBase, ["0"])
    const indicatorCard = indicatorCardsWrapper.getByTestId(indicatorCardLocator)
    await expect(indicatorCard).toContainText("Qatar")
    await expect(indicatorCard).toContainText("Gross domestic product corresponding")

    //there is a cancel button
    const addIndicatorPreviousButton = page.getByTestId(addIndicatorPreviousLocator)
    await expect(addIndicatorPreviousButton).toBeAttached()

    //there is an add indicator button that is disabled
    const addIndicatorButton = page.getByTestId(addIndicatorButtonLocator)
    await expect(addIndicatorButton).toBeDisabled()

    //click on indicator card
    await indicatorCard.click()

    //now add indicator button is not disabled
    await expect(addIndicatorButton).not.toBeDisabled()
}

const addIndicatorChartRenderTEST = async (component: MountResult, page: Page) => {
    //call the previous step
    await addIndicatorSelectorPaneTEST(component, page)

    //get the add indicator button and click it
    const addIndicatorButton = page.getByTestId(addIndicatorButtonLocator)
    await addIndicatorButton.click()

    //check that line renderer has one child
    const lineRenderer = component.locator(`#${lineRendererLocator}`)
    await expect(lineRenderer.locator('> path')).toHaveCount(1)

    //now get the legend and check it has one child
    const legendContainer = component.getByTestId(legendContainerLocator)
    await expect(legendContainer.locator('> div')).toHaveCount(1)

    //get the indicator element from the legend
    const legendElementLocator = addExtensions(legendBase, ["0"])
    const legendElement = legendContainer.getByTestId(legendElementLocator)
    await expect(legendElement).toContainText("Qatar::NGDP_FY")

    //now we have to get the chart element from the filetree
    const rootFolderLocator = addExtensions(containerFolderBase, ["0"])
    const rootFolder = component.getByTestId(rootFolderLocator)
    const rootFolderChildren = rootFolder.getByTestId(folderChildrenLocator)

    const chartElementLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const chartElement = rootFolderChildren.getByTestId(chartElementLocator)
    const chartElementChildren = rootFolderChildren.getByTestId(chartElementLocator + "-" + elementChildrenLocator)

    await page.waitForTimeout(1000 * 2.5)
    await expect(chartElementChildren.locator('> div')).toHaveCount(1)

    //check that the element child has title Qatar::NGDP_FY
    const indicatorElementLocator = chartElementLocator + "::tmp"
    const indicatorElement = chartElementChildren.getByTestId(indicatorElementLocator)
    await expect(indicatorElement).toContainText("Qatar::NGDP_FY")

    //now we have to get the tab-0 and close it
    const rootTabLocator = addExtensions(viewportTabBase, ["0"])
    const viewportTabs = component.getByTestId(viewportTabsLocator)
    const rootTab = viewportTabs.getByTestId(rootTabLocator)

    const rootTabClose = rootTab.getByTestId(closeTabLocator)
    await rootTabClose.click()

    //click on the chart element
    await chartElement.click()

    //check that line renderer has one child
    await expect(lineRenderer.locator('> path')).toHaveCount(1)
}

/**
 * this is the button that activates the new note form
 */
const newNoteButtonLocator = "new-note"

/**
 * this is the locator for the note name input in the note-create form
 */
const noteNameInputLocator = "note-name"


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

export { imageIMPL, chartIMPL }
export default createDocumentPage
