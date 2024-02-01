import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import { Locator, Page } from "@playwright/test"
import LunarRefresh from '../../../components/lunar-refresh/page'
import { createDocumentPage } from './block-types.spec';

import { 
    blockContentLocator, 
    contextMenuLocator, 
    contextMenuOptionBase, 
    contextMenuOptionsLocator, 
    documentBlockBase 
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

const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

const contextMenuMountIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to a heading
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in !
    await page.keyboard.type(`!`, { delay: 200 })
    
    //check that the context menu is mounted
    const contextMenu = page.getByTestId(contextMenuLocator)
    await expect(contextMenu).toBeAttached()

    //there are 9 divs within the context menu options
    const contextMenuOptions = contextMenu.getByTestId(contextMenuOptionsLocator)
    await expect(contextMenuOptions.locator('> div')).toHaveCount(9)

    //get option 0 and check value = "paragraph"
    const rootOptionLocator = addExtensions(contextMenuOptionBase, ["0"])
    const rootOption = contextMenuOptions.getByTestId(rootOptionLocator)
    await expect(rootOption).toHaveAttribute('data-testValue', "paragraph")

    //get option 1 and check value = "heading::1"
    const headingOptionLocator = addExtensions(contextMenuOptionBase, ["1"])
    const headingOption = contextMenuOptions.getByTestId(headingOptionLocator)
    await expect(headingOption).toHaveAttribute('data-testValue', "heading::1")

    //get option 7 and check its media::chart
    const chartOptionLocator = addExtensions(contextMenuOptionBase, ["7"])
    const chartOption = contextMenuOptions.getByTestId(chartOptionLocator)
    await expect(chartOption).toHaveAttribute('data-testValue', "media::chart")

    //get option 8 and check its media::image
    const imageOptionLocator = addExtensions(contextMenuOptionBase, ["8"])
    const imageOption = contextMenuOptions.getByTestId(imageOptionLocator)
    await expect(imageOption).toHaveAttribute('data-testValue', "media::image")
}

const contextMenuArrowKeysIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to a heading
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in !
    await page.keyboard.type(`!`, { delay: 200 })
    
    //check that the context menu is mounted
    const contextMenu = page.getByTestId(contextMenuLocator)
    await expect(contextMenu).toBeAttached()

    //check that option-0 has class option-active
    const rootOptionLocator = addExtensions(contextMenuOptionBase, ["0"])
    const rootOption = contextMenu.getByTestId(rootOptionLocator)
    await expect(rootOption).toHaveAttribute("data-active", "true")

    //press up arrow key
    await page.keyboard.press("ArrowUp")

    //get option-8 and check if active and visisble
    const lastOptionLocator = addExtensions(contextMenuOptionBase, ["8"])
    const lastOption = contextMenu.getByTestId(lastOptionLocator)

    await expect(lastOption).toHaveAttribute("data-active", "true")

    //press up arrow down
    await page.keyboard.press("ArrowDown")

    //check root option is active and visible
    await expect(rootOption).toHaveAttribute("data-active", "true")

    //press up arrow down
    await page.keyboard.press("ArrowDown")

    //check option-1 is active
    const secondOptionLocator = addExtensions(contextMenuOptionBase, ["1"])
    const secondOption = contextMenu.getByTestId(secondOptionLocator)
    await expect(secondOption).toHaveAttribute("data-active", "true")
}

const contextMenuSearchIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to a heading
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in !
    page.keyboard.type(`!`, { delay: 200 })
    
    //check that the context menu is mounted
    const contextMenu = page.getByTestId(contextMenuLocator)
    await expect(contextMenu).toBeAttached()

    //there are 9 divs within the context menu options
    const contextMenuOptions = contextMenu.getByTestId(contextMenuOptionsLocator)
    await expect(contextMenuOptions.locator('> div')).toHaveCount(9)

    //get option 0 and check value = "paragraph"
    const rootOptionLocator = addExtensions(contextMenuOptionBase, ["0"])
    const rootOption = contextMenuOptions.getByTestId(rootOptionLocator)
    await expect(rootOption).toHaveAttribute('data-testValue', "paragraph")

    //type in ch to block content input
    await page.keyboard.type(`ch`, { delay: 200 })

    //check there is 1 option within the context menu
    await expect(contextMenuOptions.locator('> div')).toHaveCount(1)

    //check the root option = media::chart
    await expect(rootOption).toHaveAttribute('data-testValue', "media::chart")

    //delete search
    page.keyboard.press("Backspace")
    page.keyboard.press("Backspace")

    //check that reverted
    await expect(contextMenuOptions.locator('> div')).toHaveCount(9)
    await expect(rootOption).toHaveAttribute('data-testValue', "paragraph")
}

const contextMenuBlockChangeIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can convert it to a heading
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in !
    await page.keyboard.type(`!h1`, { delay: 200 })
    
    //check that the context menu is mounted
    const contextMenu = page.getByTestId(contextMenuLocator)
    await expect(contextMenu).toBeAttached()

    //there are 1 divs within the context menu options
    const contextMenuOptions = contextMenu.getByTestId(contextMenuOptionsLocator)
    await expect(contextMenuOptions.locator('> div')).toHaveCount(1)

    //get option 0 and check value = "heading::1"
    const rootOptionLocator = addExtensions(contextMenuOptionBase, ["0"])
    const rootOption = contextMenuOptions.getByTestId(rootOptionLocator)
    await expect(rootOption).toHaveAttribute('data-testValue', "heading::1")

    await page.keyboard.press("Enter")

    //check that root block has value = "heading::1"
    await expect(block).toHaveAttribute('data-testValue', "heading::1")
}

test('[Lunar Document]: Context Menu Mount', async ({ mount, page }) => {
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

    await contextMenuMountIMPL(component, page)
})

test('[Lunar Document]: Context Menu Arrow Keys', async ({ mount, page }) => {
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

    await contextMenuArrowKeysIMPL(component, page)
})

test('[Lunar Document]: Context Menu Search', async ({ mount, page }) => {
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

    await contextMenuSearchIMPL(component, page)
})

test('[Lunar Document]: Context Menu Block Change', async ({ mount, page }) => {
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

    await contextMenuBlockChangeIMPL(component, page)
})