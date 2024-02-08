import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import { Locator, Page } from "@playwright/test"
import LunarRefresh from '../../../components/lunar-refresh/page'

import { 
    addChartLocator, 
    addImageLocator, 
    addRefreshChartCancelLocator, 
    addRefreshChartLocator, 
    addRefreshChartOptionBase, 
    addRefreshChartOptionsLocator, 
    addRefreshChartSubmitLocator, 
    alignCenterLocator, 
    alignLeftLocator, 
    alignRightLocator, 
    blockContentLocator, 
    documentBlockBase, 
    documentTopbarLocator, 
    documentTopbarSectionBase, 
    headingDropdownLocator, 
    headingItemBase, 
    headingItemsLocator, 
    italicizeLocator, 
    sizeHandlesLocator, 
    strikethruLocator, 
    textBoldButtonLocator, 
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
} from '../lunar-chart/mock-api'
import createDocumentPage from './util'

interface MountResult extends Locator {
    unmount(): Promise<void>;
    update(component: JSX.Element): Promise<void>;
}

const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

const topMenuMountIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //check that the topbar has 4 sections
    const documentTopbar = component.getByTestId(documentTopbarLocator)
    await expect(documentTopbar.locator('> div')).toHaveCount(7)

    //check that section 0 has 1 child
    const rootSectionLocator = addExtensions(documentTopbarSectionBase, ["0"])
    const rootSection = documentTopbar.getByTestId(rootSectionLocator)
    await expect(rootSection.locator('> div')).toHaveCount(1)

    //check that heading-dropdown is attached
    const headingDropdown = rootSection.getByTestId(headingDropdownLocator)
    await expect(headingDropdown).toBeAttached()

    //check that section 1 has 3 children
    const textSectionLocator = addExtensions(documentTopbarSectionBase, ["1"])
    const textSection = documentTopbar.getByTestId(textSectionLocator)
    await expect(textSection.locator('> button')).toHaveCount(3)

    //check that bold text is attached
    const textBoldButton = textSection.getByTestId(textBoldButtonLocator)
    await expect(textBoldButton).toBeAttached()

    //check that italic is attached
    const textItalicButton = textSection.getByTestId(italicizeLocator)
    await expect(textItalicButton).toBeAttached()

    //check that strikethru is attached
    const strikeThruButton = textSection.getByTestId(strikethruLocator)
    await expect(strikeThruButton).toBeAttached()

    //check that section-2 has 3 children
    const alignSectionLocator = addExtensions(documentTopbarSectionBase, ["2"])
    const alignSection = documentTopbar.getByTestId(alignSectionLocator)
    await expect(alignSection.locator('> button')).toHaveCount(3)

    //check that align-left is attached
    const alignLeft = alignSection.getByTestId(alignLeftLocator)
    await expect(alignLeft).toBeAttached()

    //check that align-right is attached
    const alignRight = alignSection.getByTestId(alignRightLocator)
    await expect(alignRight).toBeAttached()

    //check that align-center is attached
    const alignCenter = alignSection.getByTestId(alignCenterLocator)
    await expect(alignCenter).toBeAttached()

    //check that section-3 has 2 children attached
    const mediaSectionLocator = addExtensions(documentTopbarSectionBase, ["3"])
    const mediaSection = documentTopbar.getByTestId(mediaSectionLocator)
    await expect(mediaSection.locator('> button')).toHaveCount(2)

    //check that media chart is attached
    const addChart = mediaSection.getByTestId(addChartLocator)
    await expect(addChart).toBeAttached()

    //check that media image is attached
    const addImage = mediaSection.getByTestId(addImageLocator)
    await expect(addImage).toBeAttached()
}

const topMenuHeadingIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //check that the topbar has 4 sections
    const documentTopbar = component.getByTestId(documentTopbarLocator)
    await expect(documentTopbar.locator('> div')).toHaveCount(7)

    //check that section 0 has 1 child
    const rootSectionLocator = addExtensions(documentTopbarSectionBase, ["0"])
    const rootSection = documentTopbar.getByTestId(rootSectionLocator)
    await expect(rootSection.locator('> div')).toHaveCount(1)

    //check that heading-dropdown has activeNode = "paragraph" and then click on it
    const headingDropdown = rootSection.getByTestId(headingDropdownLocator)
    await expect(headingDropdown).toHaveAttribute("data-activeNode", "paragraph")
    await headingDropdown.click()

    //check that heading-items has 7 elements as children
    const headingItems = headingDropdown.getByTestId(headingItemsLocator)
    await expect(headingItems.locator('> div')).toHaveCount(9)

    //get heading-item-1 and check it has value = "heading::1"
    const headingItemLocator = addExtensions(headingItemBase, ["1"])
    const headingItem = headingItems.getByTestId(headingItemLocator)
    await expect(headingItem).toHaveAttribute("data-testValue", "heading::1")

    //click on the item
    await headingItem.click()
    await expect(headingDropdown).toHaveAttribute("data-activeNode", "heading::1")

    //get document-block-0 and check value = "heading::1"
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    await expect(block).toHaveAttribute("data-testValue", "heading::1")

    //now type in dummy string and create a child
    await page.keyboard.press("Space", { delay: 200 })
    await page.keyboard.type("swag", { delay: 200 })
    await page.keyboard.press("Enter")

    //check heading dropdown is paragraph again
    await expect(headingDropdown).toHaveAttribute("data-activeNode", "paragraph")
}

const topMenuTextStyleIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //check that the topbar has 4 sections
    const documentTopbar = component.getByTestId(documentTopbarLocator)
    await expect(documentTopbar.locator('> div')).toHaveCount(7)

    //check that section 1 has 3 children
    const textSectionLocator = addExtensions(documentTopbarSectionBase, ["1"])
    const textSection = documentTopbar.getByTestId(textSectionLocator)
    await expect(textSection.locator('> button')).toHaveCount(3)

    //get textBoldButton and click it
    const textBoldButton = textSection.getByTestId(textBoldButtonLocator)
    await expect(textBoldButton).toHaveAttribute("data-active", "false")
    await textBoldButton.click()

    //get the block and click on the contnet
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = await component.getByTestId(blockLocator)
    await block.getByTestId(blockContentLocator).click()

    //validate UI has updated
    await expect(textBoldButton).toHaveAttribute("data-active", "true")

    //type in test string and create new block
    await page.keyboard.type("swag", { delay: 200 })
    await page.keyboard.press("Enter")

    //check the UI state has reverted on block focus change
    await expect(textBoldButton).toHaveAttribute("data-active", "false")
    await page.keyboard.press("ArrowUp")

    await page.waitForTimeout(1000)

    await expect(textBoldButton).toHaveAttribute("data-active", "true")

    //click on bold to make sure the state reverts
    await textBoldButton.click()
    await expect(textBoldButton).toHaveAttribute("data-active", "false")

    //same with italicize, we have to measure ui state b4 change
    const textItalicButton = textSection.getByTestId(italicizeLocator)
    await expect(textItalicButton).toHaveAttribute("data-active", "false")

    //now click and measure state change
    await textItalicButton.click()
    await block.getByTestId(blockContentLocator).click()
    await expect(textItalicButton).toHaveAttribute("data-active", "true")

    //arrow down test to check if italic updates on block focus
    await page.keyboard.press("ArrowDown")
    await expect(textItalicButton).toHaveAttribute("data-active", "false")

    //back up and click to remove
    await page.keyboard.press("ArrowUp")
    await expect(textItalicButton).toHaveAttribute("data-active", "true")

    //click and measure state change
    await textItalicButton.click()
    await expect(textItalicButton).toHaveAttribute("data-active", "false")

    //same with strikethru, we have to measure UI state before the change
    const textStrikethruButton = textSection.getByTestId(strikethruLocator)
    await expect(textStrikethruButton).toHaveAttribute("data-active", "false")

    //now click and measure state change
    await textStrikethruButton.click()
    await block.getByTestId(blockContentLocator).click()
    await expect(textStrikethruButton).toHaveAttribute("data-active", "true")

    //arrow down test to check if strikethru updates on block focus
    await page.keyboard.press("ArrowDown")
    await expect(textStrikethruButton).toHaveAttribute("data-active", "false")

    //back up and click to remove
    await page.keyboard.press("ArrowUp")
    await expect(textStrikethruButton).toHaveAttribute("data-active", "true")

    //click and measure state change
    await textStrikethruButton.click()
    await expect(textStrikethruButton).toHaveAttribute("data-active", "false")
}

const topMenuTextAlignIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //check that the topbar has 4 sections
    const documentTopbar = component.getByTestId(documentTopbarLocator)
    await expect(documentTopbar.locator('> div')).toHaveCount(7)

    //check that section-2 has 3 children
    const alignSectionLocator = addExtensions(documentTopbarSectionBase, ["2"])
    const alignSection = documentTopbar.getByTestId(alignSectionLocator)
    await expect(alignSection.locator('> button')).toHaveCount(3)

    //first get align left and measure UI state
    const alignLeft = alignSection.getByTestId(alignLeftLocator)
    await expect(alignLeft).toHaveAttribute("data-active", "true")

    //now we are going to get alignCenter and click on it, then measure UI state change
    const alignCenter = alignSection.getByTestId(alignCenterLocator)
    await expect(alignCenter).toHaveAttribute("data-active", "false")

    //now click align center and measure ui change
    await alignCenter.click()
    await expect(alignCenter).toHaveAttribute("data-active", "true")
    await expect(alignLeft).toHaveAttribute("data-active", "false")

    //now lets click align right and measure before the UI state change
    const alignRight = alignSection.getByTestId(alignRightLocator)
    await expect(alignRight).toHaveAttribute("data-active", "false")

    //now click and measure the UI state change
    await alignRight.click()
    await expect(alignCenter).toHaveAttribute("data-active", "false")
    await expect(alignRight).toHaveAttribute("data-active", "true")
}


test('[Lunar Document]: Top Menu Mount', async ({ mount, page }) => {
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

    await topMenuMountIMPL(component, page)
})

test('[Lunar Document]" Top Menu Headings', async ({ mount, page }) => {
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

    await topMenuHeadingIMPL(component, page)
})

test('[Lunar Document]: Top Menu Text Styles', async ({ mount, page }) => {
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

    await topMenuTextStyleIMPL(component, page)
})

test('[Lunar Document]: Top Menu Text Align', async ({ mount, page }) => {
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

    await topMenuTextAlignIMPL(component, page)
})

