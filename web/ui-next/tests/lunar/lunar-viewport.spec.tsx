import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-13'
import LunarRefresh from '../../components/lunar-refresh/page'

/**
 * this file contains all the testing specs in order to validate that the Viewport works and integrates with other services within the container.
 * 
 * Viewport + Folder Deletion Test
 *  - the goal of this test is to test both make sure the folder deletion works and the sidebar integrates with the viewport
 *  - mount the LunarRefresh component
 *  - there is a file-dropdown-container
 *  - it has one child folder
 *  - the folder-0 = Untitled Project
 *  - there is a portal section within the toolbar
 *  - button-0 has icon with testId = folder-create
 *  - click the button
 *  - page get new folder button
 *  - click new folder button
 *  - validate folder-name = New Folder Name
 *  - type in Dummy Folder
 *  - click submit button
 *  - folder-0 has 1 folder child
 *  - folder-0::child = Dummy Folder
 *  - click on folder-0::child
 *  - click button-0
 *  - page get new note button
 *  - click new note button
 *  - validate note-name = New Note Name
 *  - type in Dummy Note
 *  - click submit button
 *  - folder-0::child has 1 child
 *  - folder-0::child element-0::child = Dummy Note
 *  - click on button-0
 *  - click on new chart button
 *  - validate chart-name = New Chart Name
 *  - type in Dummy Chart
 *  - click submit button
 *  - folder-0::child has 2 children
 *  - folder-0::child element-1::child = Dummy Chart
 *  - check that viewport-tabs is attached
 *  - check that viewport-viewport is attached
 *  - viewport-tabs has 2 children
 *  - viewport-tab-0 = Dummy Note
 *  - viewport-tab-1 = Dummy Chart
 *  - viewport-tab-1 data-testValue = "active"
 *  - viewport-viewport data-testValue = "chart"
 *  - click on viewport-tab 0
 *  - viewport-tab-0 data-testValue = "active"
 *  - viewport-viewport data-testValue = "note"
 *  - click on folder-0
 *  - button-1 is disabled
 *  - click on folder-0::child
 *  - button-1 is active
 *  - click on button 1
 *  - has delete-warning element
 *  - has confirm-checkbox element
 *  - submit button is disabled
 *  - click on confirm-checkbox input
 *  - submit button is not disabled
 *  - click submit button
 *  - folder-0 has 0 folder children
 *  - viewport-tabs has 0 children
 *  - viewport-viewport = "undefined"
 *  - folder-0 click
 *  - button-0 click
 *  - cick new note button  
 *  - type dummy note
 *  - click submit button
 *  - viewport-tabs has 1 child
 *  - viewport-tab-0 data-testValue = "active"
 *  - viewport-viewport data-testValue = "note"
 *  - viewport-tab-0 close-tab click
 *  - viewport-viewport data-testValue = "undefined"
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

/**
 * this is the container where all ui elements relating to the file
 * dropdown viewer are going to be rendered
 */
const fileDropdownContainerLocator = "file-dropdown-container"

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
 * this is the container where all the buttons in the button portal are 
 * rendered
 */
const buttonPortalLocator = "button-portal"

/**
 * this is the base to find indexed buttons within the button portal.
 * it is used in the format button-[x] where x is the index of the button
 */
const buttonBase = "button"

/**
 * this is the test-id for the icon within the folder create button,
 * use it to click on the button in a more precise manner
 */
const folderCreateLocator = "folder-create"

/**
 * this is the test-id for the icon within the folder-delete button,
 * use it to click on the button in a more precise manner
 */
const folderDeleteLocator = "folder-delete"

/**
 * this is the container where all the additional folder-create
 * menu buttons will be rendered
 */
const folderCreateMenuContainer = "folder-create-menu"

/**
 * this is the button that activates the new-folder form
 */
const newFolderButtonLocator = "new-folder"

/**
 * this is the button that activates the new-chart form
 */
const newChartButtonLocator = "new-chart"

/**
 * this is the button that activates the new note form
 */
const newNoteButtonLocator = "new-note"
/**
 * this is the locator for the cancel button in all generated forms
 */
const cancelButtonLocator = "cancel-button"

/**
 * this is the locator for the submit button in all generated forms
 */
const submitButtonLocator = "submit-button"

/**
 * this is the locator for the folder name input in the folder-create form
 */
const folderNameInputLocator = "folder-name"

/**
 * this is the locator for the chart name input in the chart-create form
 */
const chartNameInputLocator = "chart-name"

/**
 * this is the locator for the note name input in the note-create form
 */
const noteNameInputLocator = "note-name"

/**
 * this is the locator for the tabs container in the viewport
 */
const viewportTabsLocator = "viewport-tabs"

/**
 * this is the locator for a viewport tab within the viewport tabs container
 */
const viewportTabBase = "viewport-tab"

/**
 * this is the container for the actual viewport displayport
 */
const viewportViewportLocator = "viewport-display"

/**
 * this is the warning box when you try to delete an element in the project
 */
const deleteWarningLocator = "delete-warning"

/**
 * this is locator for the confirm checkbox to make sure you want to delete an element
 */
const confirmCheckboxLocator = "confirm-checkbox"

test('Lunar Refresh Viewport + Folder Deletion integration test', async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //first we will check that the file-dropdown-container is attached
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()

    //now we need to check that it only has 1 child folders
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    
    //now we need to get folder-0 and check it equals Untitled Project
    const projectFolderLocator = addExtensions(containerFolderBase, ["0"])
    const projectFolder = fileDropdownContainer.getByTestId(projectFolderLocator)
    await expect(projectFolder).toContainText("Untitled Project")

    //now we need to check that there is a portal section within the toolbar
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal).toBeAttached()

    //now we need to validate button-0 has folder-create attached
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    const buttonZeroSVGTestId = await buttonZero.locator('svg').getAttribute('data-testId')
    await expect(buttonZeroSVGTestId).toBe(folderCreateLocator)

    //now we want to click button zero
    await buttonZero.click()

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

    //now we need to check the projectFolder has 1 child folder
    const projectFolderChildren = projectFolder.getByTestId(folderChildrenLocator)
    await expect(projectFolderChildren.locator('> div')).toHaveCount(1)

    //now we need to check the child folder = Dummy Folder
    const dummyFolderLocator = projectFolderLocator + "::child"
    const dummyFolder = projectFolderChildren.getByTestId(dummyFolderLocator)
    await expect(dummyFolder).toContainText("Dummy Folder")

    //now we want to click on the dummy folder
    
})