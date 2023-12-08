import { test, expect } from '@playwright/experimental-ct-react'
import { Locator, Page, Route } from "@playwright/test"
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import LunarRefresh from '../../../components/lunar-refresh/page'
import { IStatus } from '../../../components/data/datasets/DatasetsTypes'
import { IDatasetCard } from '../../../components/data/quanta/dataset-api'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'
import { quantaPrimeDatasetROUTE, quantaPublicPublishedDatasetsROUTE, quantaSelectIndicatorLengthROUTE, quantaSelectPagedIndicatorsROUTE } from './mock-api'

/**
 * NOTE: The testing spec is provided in the obsidian documentation for easier viewing. 
 */

//utility function that add extensions to a locator

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

//where all the buttons are in the toolbar
const buttonPortalLocator = "button-portal"
//specific button that is within the portal. (note this is a base, and needs to be combined with an index)
const buttonPortalButtonBase = "button"
//this is the button that opens the new chart modal
const newChartLocator = "new-chart"
//this is the container for the add indicator modal
const addIndicatorModalLocator = "add-indicator-modal"
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
//this is the locaor for the chart settings toolbar button
const chartSettingsLocator = "chart-settings"
//this is the locator for the chart settings modal
const chartSettingsModalLocator = "chart-settings-modal"
//this is the locator for the sections wrapper
const chartSettingsSectionsLocators = "chart-settings-sections"
//this is the base for a section
const sectionBase = "section"
//wrapper for all the indicators in the settings pane
const chartIndicatorSettingsLocators = "chart-indicators-settings"
//indicator within the setting pane
const chartIndicatorSettingsBase = "chart-setting-indicator"
//delete button within indicator setting
const chartIndicatorSettingDelete = "indicator-delete"
//cancel button
const indicatorCancelLocator = "indicator-cancel"
//indicator delete
const indicatorDeleteLocator = "indicator-delete"
//indicator warning
const indicatorWarningLocator = "indicator-warning"
//confirm checkbox
const indicatorCheckboxLocator = "indicator-checkbox"
//toolbar button to delete indicator
const toolbarIndicatorDeleteLocator = "toolbar-indicator-delete"
//indicator flow container
const addIndicatorFlowContainerLocator = "add-indicator-flow-container"
//legend delete button
const legendDeleteLocator = "legend-delete"

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
    const chartElementChildren = chartElement.getByTestId(elementChildrenLocator)
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

//this is a reusable function that tests the delete flow
const deleteIndicatorModalFLOW = async (component: MountResult, page: Page) => {
    //check there is a cancel button attached
    const chartSettingsModal = page.getByTestId(chartSettingsModalLocator)
    const indicatorCancel = chartSettingsModal.getByTestId(indicatorCancelLocator)
    await expect(indicatorCancel).toBeAttached()

    //check that there is a delete button and it is disabled
    const indicatorDelete = chartSettingsModal.getByTestId(indicatorDeleteLocator)
    await expect(indicatorDelete).toBeDisabled()

    //check that there is an alert warning attached
    const indicatorWarning = chartSettingsModal.getByTestId(indicatorWarningLocator)
    await expect(indicatorWarning).toBeAttached()

    //there is a confirm checkbox attached
    const indicatorCheckbox = chartSettingsModal.getByTestId(indicatorCheckboxLocator)
    await expect(indicatorCheckbox).toBeAttached()

    //now click on the raw input element
    const indicatorCheckboxRAW = indicatorCheckbox.locator('input')
    await indicatorCheckboxRAW.click()

    //check the delete button isnt disabled and then click it
    await expect(indicatorDelete).not.toBeDisabled()
    await indicatorDelete.click()

    //check that line renderer has 0 children
    const lineRenderer = component.locator(`#${lineRendererLocator}`)
    await expect(lineRenderer.locator('> path')).toHaveCount(0)
}

const deleteIndicatorModalTEST = async (component: MountResult, page: Page) => {
    //call the previous step
    await addIndicatorChartRenderTEST(component, page)

    //get the chart and click on it in the filetree
    const rootFolderLocator = addExtensions(containerFolderBase, ["0"])
    const rootFolder = component.getByTestId(rootFolderLocator)
    const rootFolderChildren = rootFolder.getByTestId(folderChildrenLocator)

    const chartElementLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const chartElement = rootFolderChildren.getByTestId(chartElementLocator)
    await chartElement.click()

    //now we have to get the chart settings button from the toolbar
    const settingsToolbarButtonLocator = addExtensions(buttonPortalButtonBase, ["1"])
    const settingsToolbarButton = component.getByTestId(settingsToolbarButtonLocator)
    await settingsToolbarButton.click()

    //validate that the chart settings modal container is attached
    const chartSettingsModal = page.getByTestId(chartSettingsModalLocator)
    await expect(chartSettingsModal).toBeAttached()

    //check that there is one section in the modal
    await expect(chartSettingsModal.locator('> div')).toHaveCount(1)

    //get section-0's title
    const indicatorSectionLocator = addExtensions(sectionBase, ["0"])
    const indicatorSection = chartSettingsModal.getByTestId(indicatorSectionLocator)
    const indicatorSectionTitle = indicatorSection.getByTestId("section-title")
    await expect(indicatorSectionTitle).toContainText("Chart Indicators")

    //validate that there is one indicator in the section
    const indicatorSettingsContainer = indicatorSection.getByTestId(chartIndicatorSettingsLocators)
    await expect(indicatorSettingsContainer.locator('> div')).toHaveCount(1)

    //get the dummy indicator from the settings
    const dummyIndicatorLocator = addExtensions(chartIndicatorSettingsBase, ["0"])
    const dummyIndicator = indicatorSettingsContainer.getByTestId(dummyIndicatorLocator)
    await expect(dummyIndicator).toContainText("Qatar::NGDP_FY")

    //get the delete button and click it
    const dummyIndicatorDelete = dummyIndicator.getByTestId(chartIndicatorSettingDelete)
    await dummyIndicatorDelete.click()

    //test the delete test flow
    await deleteIndicatorModalFLOW(component, page)
}

const deleteIndicatorToolbarTEST = async (component: MountResult, page: Page) => {
    //call the previous step
    await addIndicatorChartRenderTEST(component, page)

    //get the indicator and click on it in the filetree
    const rootFolderLocator = addExtensions(containerFolderBase, ["0"])
    const rootFolder = component.getByTestId(rootFolderLocator)
    const rootFolderChildren = rootFolder.getByTestId(folderChildrenLocator)

    const chartElementLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const chartElement = rootFolderChildren.getByTestId(chartElementLocator)
    const chartElementChildren = chartElement.getByTestId(elementChildrenLocator)

    const indicatorElementLocator = chartElementLocator
    const indicatorElement = chartElementChildren.getByTestId(indicatorElementLocator)
    await indicatorElement.click()

    //now we have to click on the delete button in the toolbar
    const indicatorDeleteButtonLocator = addExtensions(buttonPortalButtonBase, ["0"])
    const indicatorDeleteButton = component.getByTestId(indicatorDeleteButtonLocator)
    await indicatorDeleteButton.click()

    //test the delete flow
    await deleteIndicatorModalFLOW(component, page)
}

const deleteIndicatorChartLegendTEST = async (component: MountResult, page: Page) => {
    //call the previous step
    await addIndicatorChartRenderTEST(component, page)

    //now get the legend and check it has one child
    const legendContainer = component.getByTestId(legendContainerLocator)
    await expect(legendContainer.locator('> div')).toHaveCount(1)

    //get the indicator element from the legend
    const legendElementLocator = addExtensions(legendBase, ["0"])
    const legendElement = legendContainer.getByTestId(legendElementLocator)
    await expect(legendElement).toContainText("Qatar::NGDP_FY")

    //get the close button and click on it
    const legendDelete = legendElement.getByTestId(legendDeleteLocator)
    await legendDelete.click()

    //test the delete flow
    await deleteIndicatorModalFLOW(component, page)
}

test('[Add Indicator]: Modal Base', async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true} />
        </MemoryRouterProvider>
    )

    await openAddIndicatorModalTEST(component, page)
})

test('[Add Indicator]: Dataset Pane Test', async ({ mount, page }) => {
    //set up the mocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true}  />
        </MemoryRouterProvider>
    )

    
    await addIndicatorDatasetPaneTEST(component, page)
})

test('[Add Indicator]: Indicator Selector Pane Test', async ({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true}  />
        </MemoryRouterProvider>
    )

    await addIndicatorSelectorPaneTEST(component, page)
})

test('[Add Indicator]: Chart Render / Legend Test', async ({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true}  />
        </MemoryRouterProvider>
    )

    await addIndicatorChartRenderTEST(component, page)
})

test('[Delete Indicator]: Settings Modal Test', async ({ mount, page }) => {
     //set up th emocked routes before the mount
     await quantaPublicPublishedDatasetsROUTE(page)
     await quantaPrimeDatasetROUTE(page)
     await quantaSelectIndicatorLengthROUTE(page)
     await quantaSelectPagedIndicatorsROUTE(page)

     const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true}  />
        </MemoryRouterProvider>
    )

    await deleteIndicatorModalTEST(component, page)
})

test('[Delete Indicator]: Indicator Toolbar Test', async ({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)

    const component = await mount (
       <MemoryRouterProvider url={'/lunar'}>
           <LunarRefresh defaultDebugMode={true}  />
       </MemoryRouterProvider>
   )

   await deleteIndicatorToolbarTEST(component, page)
})

test('[Delete Indicator]: Chart Legend Test', async ({ mount, page }) => {
    //set up th emocked routes before the mount
    await quantaPublicPublishedDatasetsROUTE(page)
    await quantaPrimeDatasetROUTE(page)
    await quantaSelectIndicatorLengthROUTE(page)
    await quantaSelectPagedIndicatorsROUTE(page)

    const component = await mount (
       <MemoryRouterProvider url={'/lunar'}>
           <LunarRefresh defaultDebugMode={true}  />
       </MemoryRouterProvider>
   )

   await deleteIndicatorChartLegendTEST(component, page)
})