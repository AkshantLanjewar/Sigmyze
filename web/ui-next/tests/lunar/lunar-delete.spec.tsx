import { Locator, Page, Route } from "@playwright/test"
import { test, expect } from '@playwright/experimental-ct-react'

import {
    buttonBase,
    buttonPortalLocator,
    chartNameInputLocator,
    containerElementBase,
    containerFolderBase,
    folderChildrenLocator,
    folderCreateMenuContainer,
    folderNameInputLocator,
    newChartButtonLocator,
    newFolderButtonLocator,
    newNoteButtonLocator,
    noteNameInputLocator,
    submitButtonLocator
} from './locators'
import { MemoryRouterProvider } from "next-router-mock/dist/MemoryRouterProvider/next-11"
import LunarRefresh from "../../components/lunar-refresh/page"

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

/*
 * this is the locator for the wrapper for the delete note modal 
 */
const deleteNoteModalLocator = "delete-note-modal"

/*
 * the locator for the cancel button 
 */
const cancelButtonLocator = "cancel-button" 

/*
 * the locator for the confirm delete input 
 */
const confirmDeleteLocator = "confirm-checkbox"

const deleteNote = async (component: MountResult, page: Page, fileChildren: Locator) => {
    //open the menu containing the create options 
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await buttonZero.click()

    //create a note
    const folderCreateMenu = page.getByTestId(folderCreateMenuContainer)
    const newNoteButton = folderCreateMenu.getByTestId(newNoteButtonLocator)
    await newNoteButton.click()
    //now we need to validate that note-name = New Note Name
    const noteNameInput = page.getByTestId(noteNameInputLocator)
    await expect(noteNameInput).toContainText("New Note Name")
    //now we need to type in the value Dummy Note
    const noteNameRaw = noteNameInput.locator('input')
    await noteNameRaw.type('Dummy Note', { delay: 200 })
    //now we need to submit the folder
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we need to check the child element is Dummy Folder
    const elementZeroLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const elementZero = fileChildren.getByTestId(elementZeroLocator)
    await expect(elementZero).toContainText("Dummy Note")
    await expect(elementZero).toHaveAttribute("data-active", "true")

    //now we need to get button 1 (documents delete button) and click it 
    const buttonOneLocator = addExtensions(buttonBase, ["1"])
    const buttonOne = buttonPortal.getByTestId(buttonOneLocator)
    await buttonOne.click()

    //check the delete note modal is attached
    const deleteNoteModal = page.getByTestId(deleteNoteModalLocator)
    await expect(deleteNoteModal).toBeAttached()

    //there is a cancel button attached 
    const cancelButton = deleteNoteModal.getByTestId(cancelButtonLocator)
    await expect(cancelButton).toBeAttached()

    //check that the submit button is disabled 
    await expect(submitButton).toBeDisabled()

    //get the confirm delete and click on the locator 
    const confirmDelete = deleteNoteModal.getByTestId(confirmDeleteLocator)
    await expect(confirmDelete).toBeAttached()
    await confirmDelete.locator('input').click()

    //submit button isnt disabled and we click it 
    await expect(submitButton).not.toBeDisabled()
    await submitButton.click()

    //check that elementZero is not attached 
    await expect(elementZero).not.toBeAttached()
} 

/*
 * this is the locator for the wrapper for the delete chart modal 
 */
const deleteChartModalLocator = "delete-chart-modal"

const deleteChart = async (component: MountResult, page: Page, folderChildren: Locator) => {
    //open the menu containing the create options 
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await buttonZero.click()

    //now we get the new chart button
    const folderCreateMenu = page.getByTestId(folderCreateMenuContainer)
    const newChartButton = folderCreateMenu.getByTestId(newChartButtonLocator)
    await newChartButton.click()

    //now we need to validate that chart-name = New Chart Name
    const chartNameInput = page.getByTestId(chartNameInputLocator)
    await expect(chartNameInput).toContainText("New Chart Name")
    //now we need to type in the value Dummy Chart
    const chartNameRaw = chartNameInput.locator('input')
    await chartNameRaw.type("Dummy Chart", { delay: 200 })
    //now we need to submit the folder
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()
    //now we need to check that folder-0 has 1 child
    await expect(folderChildren.locator('> button')).toHaveCount(1)

    //now we need to check the child element is Dummy Folder
    const elementZeroLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const elementZero = folderChildren.getByTestId(elementZeroLocator)
    await expect(elementZero).toContainText("Dummy Chart")
    await expect(elementZero).toHaveAttribute("data-active", "true")

    //get button 3 and click it
    const buttonThreeLocator = addExtensions(buttonBase, ["2"])
    const buttonThree = buttonPortal.getByTestId(buttonThreeLocator)
    await buttonThree.click()

    //get the delete chart modal 
    const deleteChartModal = page.getByTestId(deleteChartModalLocator)
    await expect(deleteChartModal).toBeAttached()
    
    //there is a cancel button attached 
    const cancelButton = deleteChartModal.getByTestId(cancelButtonLocator)
    await expect(cancelButton).toBeAttached()

    //check that the submit button is disabled 
    await expect(submitButton).toBeDisabled()

    //get the confirm delete and click on the locator 
    const confirmDelete = deleteChartModal.getByTestId(confirmDeleteLocator)
    await confirmDelete.locator('input').click()

    //submit button isnt disabled and we click it 
    await expect(submitButton).not.toBeDisabled()
    await submitButton.click()

    //check that elementZero is not attached 
    await expect(elementZero).not.toBeAttached()
}

/**
 * this is the locator for the tabs container in the viewport
 */
const viewportTabsLocator = "viewport-tabs"

/**
 * this is the locator for a viewport tab within the viewport tabs container
 */
const viewportTabBase = "viewport-tab"

test("[Lunar Delete]: Base Case", async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //check that there are no viewport tabs attached 
    const viewportTabs = component.getByTestId(viewportTabsLocator)
    await expect(viewportTabs.locator('> div')).toHaveCount(0)

    //get folder-0 children 
    const rootFolderLocator = addExtensions(containerFolderBase, ["0"])
    const rootFolder = component.getByTestId(rootFolderLocator)
    const rootFolderChildren = rootFolder.getByTestId(folderChildrenLocator)

    //call the delete note function 
    await deleteNote(component, page, rootFolderChildren)
    //check that there are no tabs attached 
    await expect(viewportTabs.locator('> div')).toHaveCount(0)

    //call the delete chart function 
    await deleteChart(component, page, rootFolderChildren)
    //check that there are no tabs attached 
    await expect(viewportTabs.locator('> div')).toHaveCount(0)
})

test("[Lunar Delete]: Inductive Case", async({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //check that there are no viewport tabs attached 
    const viewportTabs = component.getByTestId(viewportTabsLocator)
    await expect(viewportTabs.locator('> div')).toHaveCount(0)

    //now we need to check that there is a portal section within the toolbar
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal).toBeAttached()

    //now we need to validate button-0 has folder-create attached
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    //now we want to click button zero
    await buttonZero.click()

    //get folder-0 children 
    const rootFolderLocator = addExtensions(containerFolderBase, ["0"])
    const rootFolder = component.getByTestId(rootFolderLocator)
    const rootFolderChildren = rootFolder.getByTestId(folderChildrenLocator)

    //now we need to get the new folder button and click it
    const newFolderButton = page.getByTestId(newFolderButtonLocator)
    await newFolderButton.click()

    //now we need to check the folder-name input = New Folder Name
    const folderNameInput = page.getByTestId(folderNameInputLocator)
    await expect(folderNameInput).toContainText("New Folder Name")

    //now we need to type in Dummy Folder into the input
    const folderNameRaw = folderNameInput.locator('input')
    await folderNameRaw.type('Dummy Folder', { delay: 200 })

    //now we need to submit the form
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we need to check the child folder = Dummy Folder
    const dummyFolderLocator = rootFolderLocator + "::child"
    const dummyFolder = rootFolderChildren.getByTestId(dummyFolderLocator)
    const dummyFolderChildren = dummyFolder.getByTestId(folderChildrenLocator)
    await expect(dummyFolder).toContainText("Dummy Folder")

    //now we want to click on the dummy folder
    await dummyFolder.locator('button').first().click()
    await dummyFolder.locator('button').first().click()
    await expect(dummyFolder).toHaveAttribute('data-active', 'true')

    //call the delete note function 
    await deleteNote(component, page, dummyFolderChildren)
    //check that there are no tabs attached 
    await expect(viewportTabs.locator('> div')).toHaveCount(0)
    await expect(dummyFolder).toHaveAttribute('data-active', 'true')

    //call the delete chart function 
    await deleteChart(component, page, dummyFolderChildren)
    //check that there are no tabs attached 
    await expect(viewportTabs.locator('> div')).toHaveCount(0)
    await expect(dummyFolder).toHaveAttribute('data-active', 'true')
})
