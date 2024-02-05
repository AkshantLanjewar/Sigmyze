import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import { Locator, Page } from "@playwright/test"
import LunarRefresh from '../../../components/lunar-refresh/page'
import { chartIMPL, createDocumentPage, imageIMPL } from './block-types.spec'

import { 
    blockContentLocator, 
    deleteChartLocator, 
    deleteChartModalLocator, 
    deleteImageLocator, 
    deleteImageModalLocator, 
    documentBlockBase, 
    documentContainerLocator 
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

const deleteTextBlockIMPL = async (component: MountResult, page: Page) => {
    //first we need to create a fresh document page for our test
    await createDocumentPage(component, page)

    //type in test string and create a new block
    await page.keyboard.type("swag", { delay: 200 })
    await page.keyboard.press("Enter")

    //check that there are 2 elements within the document container
    const documentContainer = component.getByTestId(documentContainerLocator)
    await expect(documentContainer.locator('> div')).toHaveCount(2)

    //press backspace and check that there is one element
    await page.keyboard.press("Backspace")
    await expect(documentContainer.locator('> div')).toHaveCount(1)
}

const deleteImageBlockIMPL = async (component: MountResult, page: Page) => {
    //execute the create image test
    await imageIMPL(component, page)

    //click on block-0 block-content
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId("image-body")

    await blockContent.click()

    //check that delete image is attached and click on it
    const deleteImage = block.getByTestId(deleteImageLocator)
    await expect(deleteImage).toBeAttached()
    
    await deleteImage.click()
    await deleteImage.click()

    //delete image modal is attached
    const deleteImageModal = page.getByTestId(deleteImageModalLocator)
    await expect(deleteImageModal).toBeAttached()

    //there is a cancel button attached
    const cancelButton = page.getByTestId("cancel-button")
    await expect(cancelButton).toBeAttached()

    //there is a delete button that is disabled
    const deleteButton = page.getByTestId('submit-button')
    await expect(deleteButton).toBeDisabled()

    //check there is a warning attached
    const warning = deleteImageModal.getByTestId('delete-warning')
    await expect(warning).toBeAttached()

    //get the input and click it
    const input = deleteImageModal.locator('input')
    await input.click()

    //now the delete button isnt disabled and we click it
    await expect(deleteButton).not.toBeDisabled()
    await deleteButton.click()

    //now check that block-0 = "paragraph"
    await expect(block).toHaveAttribute('data-testValue', "paragraph")
}

const deleteChartBlockIMPL = async (component: MountResult, page: Page) => {
    //execute the create chart test
    await chartIMPL(component, page)

    //click on block-0 block-content
    const blockLocator = addExtensions(documentBlockBase, ["0"])
    const block = component.getByTestId(blockLocator)
    const blockContent = block.getByTestId(blockContentLocator)

    await blockContent.click()

    //check that delete chart is attached and click it
    const deleteChart = block.getByTestId(deleteChartLocator)
    await expect(deleteChart).toBeAttached()
    await deleteChart.click()

    //check that the delete chart modal is attached
    const deleteChartModal = page.getByTestId(deleteChartModalLocator)
    await expect(deleteChartModal).toBeAttached()

    //check that there is a cancel button attached
    const cancel = page.getByTestId("cancel")
    await expect(cancel).toBeAttached()

    //check that there is a delete button that is disabled
    const deleteButton = page.getByTestId('chart-delete')
    await expect(deleteButton).toBeDisabled()

    //check there is a warning attached
    const warning = deleteChartModal.getByTestId('warning')
    await expect(warning).toBeAttached()

    //get the input and click it
    const input = deleteChartModal.locator('input')
    await input.click()

    //now the delete button isnt disabled and we click it
    await expect(deleteButton).not.toBeDisabled()
    await deleteButton.click()

    //now check that block-0 = "paragraph"
    await expect(block).toHaveAttribute('data-testValue', "paragraph")
}

test('[Lunar Document]: Delete Text Block', async ({ mount, page }) => {
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

    await deleteTextBlockIMPL(component, page)
})

test('[Lunar Document]: Delete Image Block', async ({ mount, page }) => {
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

    await deleteImageBlockIMPL(component, page)
})

test('[Lunar Document]: Delete Chart Block', async ({ mount, page }) => {
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

    await deleteChartBlockIMPL(component, page)
})