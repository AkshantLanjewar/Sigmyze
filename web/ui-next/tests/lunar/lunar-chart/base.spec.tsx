import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import LunarRefresh from '../../../components/lunar-refresh/page'

/**
 * NOTE: The goal of this test is to test the basic functionality of a chart. The testing should cover theese core features:
 *  1. The name of the chart updating its file name in the editor, and in the sidebar
 *  2. A basic settings modal that can change the name of the chart
 *  3. a x-axis is rendered
 *  4. a y-axis is rendered
 *  5. debug-mode is true so a default chart renders
 *  6. x-axis contains September
 *  7. y-axis contains 6
 * 
 * [Title Test]: This test will cover all the tests related to the title of the chart
 *  - click button-0
 *  - page get new chart button
 *  - click new chart button
 *  - validate chart-name = New Chart Name
 *  - type in swag
 *  - click submit button
 *  - refresh-chart is attached
 *  - refresh-chart has a child chart-title which is attached
 *  - chart-title has text (swag)
 *  - click on chart-title
 *  - get chart-title-input
 *  - type Dummy Chart Title
 *  - click on viewport-tabs
 *  - file-dropdown-container has container-element-0 = Dummy Chart Title
 * 
 * [Chart Render Test]: 
 *  - click button-0
 *  - page get new chart button
 *  - click new chart button
 *  - validate chart-name = New Folder Name
 *  - type in swag
 *  - click submit button
 *  - x-axis is attached
 *  - x-axis contains september
 *  - y-axis is attached
 *  - y-axis contains 6
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

//locators for the tests are below

/**
 * this is the base to find indexed buttons within the button portal.
 * it is used in the format button-[x] where x is the index of the button
 */
const buttonBase = "button"

/**
 * this is the button that activates the new-chart form
 */
const newChartButtonLocator = "new-chart"

/**
 * this is the locator for the chart name input in the chart-create form
 */
const chartNameInputLocator = "chart-name"

/**
 * this is the locator for the submit button in all generated forms
 */
const submitButtonLocator = "submit-button"

/**
 * this is the locator for the tabs container in the viewport
 */
const viewportTabsLocator = "viewport-tabs"

/**
 * This is the locator that is the container for all the chart elements in a refresh-chart
 */
const refreshChartLocator = "refresh-chart"

/**
 * This is the button / title for the chart
 */
const chartTitleLocator = "chart-title"

/**
 * This is the input for when the chart title is in edit mode
 */
const chartTitleInputLocator = "chart-title-input"

/**
 * This is the container for the x-axis in the chart
 */
const xAxisLocator = "chart-x-axis"

/**
 * This is the container for the y-axis in the chart
 */
const yAxisLocator = "chart-y-axis"

/**
 * this is the container where all ui elements relating to the file
 * dropdown viewer are going to be rendered
 */
const fileDropdownContainerLocator = "file-dropdown-container"

/**
 * this is the base used to find indexed files within the file tree viewer
 * it is used in the format container-element-[x], where x is the index
 */
const containerElementBase = "container-element"

test('Title Test', async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true} />
        </MemoryRouterProvider>
    )

    //first we want to click button-0 to activate the create menu
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = component.getByTestId(buttonZeroLocator)
    await buttonZero.click()

    //then we want to get the new chart button and click it
    const newChartButton = page.getByTestId(newChartButtonLocator)
    await newChartButton.click()

    //then we want to validate chart-name = New Chart Name
    const chartNameInput = page.getByTestId(chartNameInputLocator)
    await expect(chartNameInput).toContainText("New Chart Name")

    //now we want to get the raw input and type in swag
    const chartNameInputRaw = chartNameInput.locator('input')
    await chartNameInputRaw.type("swag", { delay: 200 })

    //get the submit button and click it
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we need to check the file-dropdown container is attached
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()

    //now we need to check that container-element-0::child = swag
    const chartContainerElementLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const chartContainerElement = component.getByTestId(chartContainerElementLocator)
    await expect(chartContainerElement).toContainText("swag")

    //now we check that refreshChart is attached
    const refreshChart = component.getByTestId(refreshChartLocator)
    await expect(refreshChart).toBeAttached()

    //we want to check chart-title = swag
    const chartTitle = refreshChart.getByTestId(chartTitleLocator)
    await expect(chartTitle).toContainText("swag")

    //now we want to click on the chartTitle
    await chartTitle.click()

    //since content-editable, page keyboard type
    await page.keyboard.type('Dummy Chart Title')

    //click on viewport-tabs
    const viewportTabs = component.getByTestId(viewportTabsLocator)
    await viewportTabs.click()

    //now the chartContainerElement = Dummy Chart Title
    await expect(chartContainerElement).toContainText("Dummy Chart Title")
})

test('Chart Render Test', async({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh defaultDebugMode={true} />
        </MemoryRouterProvider>
    )

    //first we want to click button-0 to activate the create menu
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = component.getByTestId(buttonZeroLocator)
    await buttonZero.click()

    //then we want to get the new chart button and click it
    const newChartButton = page.getByTestId(newChartButtonLocator)
    await newChartButton.click()

    //then we want to validate chart-name = New Chart Name
    const chartNameInput = page.getByTestId(chartNameInputLocator)
    await expect(chartNameInput).toContainText("New Chart Name")

    //now we want to get the raw input and type in swag
    const chartNameInputRaw = chartNameInput.locator('input')
    await chartNameInputRaw.type("swag", { delay: 200 })

    //get the submit button and click it
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we need to check the file-dropdown container is attached
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()

    //now we need to check that container-element-0::child = swag
    const chartContainerElementLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const chartContainerElement = component.getByTestId(chartContainerElementLocator)
    await expect(chartContainerElement).toContainText("swag")
    
    await page.waitForTimeout(1000 * 2)

    //check the x-axis contains September
    const xAxis = component.locator(`[data-testid="${xAxisLocator}"]`)
    await expect(xAxis).toContainText("April")

    //check that y-axis contains 6
    const yAxis = component.locator(`[data-testid="${yAxisLocator}"]`)
    await expect(yAxis).toContainText("6")
})