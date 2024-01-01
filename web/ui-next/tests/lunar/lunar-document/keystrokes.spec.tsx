import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import { Locator, Page } from "@playwright/test"
import LunarRefresh from '../../../components/lunar-refresh/page';
import { createDocumentPage } from './block-types.spec';

import { 
    blockContentLocator, 
    documentBlockBase, 
    documentContainerLocator, 
    nestedChildrenLocator, 
    nestedTitleBlockLocator 
} from './locators'

import { 
    quantaPublicPublishedDatasetsROUTE, 
    quantaPrimeDatasetROUTE, 
    quantaSelectIndicatorLengthROUTE, 
    quantaSelectPagedIndicatorsROUTE, 
    quantaSelectIndicator 
} from '../lunar-chart/mock-api'

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

const makeChildIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can type in
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await expect(block).toHaveAttribute('data-testValue', "paragraph")

    //type in child parent test
    await page.keyboard.type("child parent test", { delay: 200 })
    await page.keyboard.type("Enter")

    //there are 2 elements within the document container
    const documentContainer = component.getByTestId(documentContainerLocator)
    await expect(documentContainer.locator('> div')).toHaveCount(2)

    //press tab
    await page.keyboard.press("Tab")

    //there is only 1 element within the document container
    await expect(documentContainer.locator('> div')).toHaveCount(1)

    //check it has value = "nested-block"
    await expect(block).toHaveAttribute('data-testValue', "nested-block")

    //check that nested title block is attached
    const nestedTitle = block.getByTestId(nestedTitleBlockLocator)
    await expect(nestedTitle).toContainText("child parent test")

    //check that nested children is attached as well
    const nestedChildren = block.getByTestId(nestedChildrenLocator)
    await expect(nestedChildren.locator('> div')).toHaveCount(1)

    //check that nested-block-0 has value = "paragraph"
    const nestedBlockLocator = blockLocator + "::child::0"
    const nestedBlock = nestedChildren.getByTestId(nestedBlockLocator)
    await expect(nestedBlock).toHaveAttribute('data-testValue', "paragraph")
}

const reverseChildIMPL = async (component: MountResult, page: Page) => {
    //call the make child test
    await makeChildIMPL(component, page)

    //get the childBlock's block content
    const nestedBlockLocator = addExtensions(documentBlockBase, ["0"]) + "::child::0"
    const nestedBlock = component.getByTestId(nestedBlockLocator)
    const blockContent = nestedBlock.getByTestId(blockContentLocator)

    //click the block content and press shift tab
    await blockContent.click()
    await page.keyboard.press("Shift+Tab")

    //check that there are 2 components within the document container
    const documentContainer = component.getByTestId(documentContainerLocator)
    await expect(documentContainer.locator('> div')).toHaveCount(2)

    //check that block-0 has value = paragraph
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    await expect(block).toHaveAttribute('data-testValue', "paragraph")
}

const mixedIMPL = async (component: MountResult, page: Page) => {
    //call the make child test
    await makeChildIMPL(component, page)

    //get the childBlock's block content
    const nestedBlockLocator = addExtensions(documentBlockBase, ["0"]) + "::child::0"
    const nestedBlock = component.getByTestId(nestedBlockLocator)
    const blockContent = nestedBlock.getByTestId(blockContentLocator)

    //click the block content and type in test value and tab
    await blockContent.click()
    await page.keyboard.type("test subtitle", { delay: 200 })
    await page.keyboard.press("Enter")

    //check that there are 2 blocks within nested children
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const nestedChildren = block.getByTestId(nestedChildrenLocator)

    await expect(nestedChildren.locator('> div')).toHaveCount(2)
    await page.keyboard.press('Tab')
    await expect(nestedChildren.locator('> div')).toHaveCount(1)

    //now we press shift+tab and check that there are 2 elements
    await page.keyboard.press("Shift+Tab")
    await expect(nestedChildren.locator('> div')).toHaveCount(2)
}

const arrowKeysIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //we want to get document-block-0's block content so we can type in
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()
    await page.keyboard.press('Enter')

    //there are 2 elements within the document container
    const documentContainer = component.getByTestId(documentContainerLocator)
    await expect(documentContainer.locator('> div')).toHaveCount(2)

    //press the downarrow key
    await page.keyboard.press("ArrowDown")

    //check that block-0 has active = false
    await expect(block).toHaveAttribute("data-active", "false")

    //check that block-1 has active = true
    const alternateBlockLocator = addExtensions(documentBlockBase, ["1"])
    const alternateBlock = component.getByTestId(alternateBlockLocator)
    await expect(alternateBlock).toHaveAttribute("data-active", "true")

    //press uparrow key
    await page.keyboard.press("ArrowUp")

    //check that block-0 = true and block-1 = false
    await expect(block).toHaveAttribute("data-active", "true")
    await expect(alternateBlock).toHaveAttribute("data-active", "false")
}

test('[Lunar Document]: Make Text Block Child Element', async ({ mount, page }) => {
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

    await makeChildIMPL(component, page)
})

test('[Lunar Document]: Reverse Child Element', async ({ mount, page }) => {
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

    await reverseChildIMPL(component, page)
})

test('[Lunar Document]: Mixed Test', async ({ mount, page }) => {
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

    await mixedIMPL(component, page)
})

test('[Lunar Document]: Arrow Keys', async ({ mount, page }) => {
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

    await arrowKeysIMPL(component, page)
})