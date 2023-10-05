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

/**
 * this is the locator for the close button within a tab
 */
const closeTabLocator = "close-tab"

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
    await dummyFolder.locator('button').first().click()

    //now we to click buttonZero again
    await buttonZero.click()

    //now we need to get the new note button and click it
    const newNoteButton = page.getByTestId(newNoteButtonLocator)
    await newNoteButton.click()

    //now we need to check note-name = New Note Name
    const noteNameInput = page.getByTestId(noteNameInputLocator)
    await expect(noteNameInput).toContainText("New Note Name")

    //now we need to type in dummy note into the input
    const noteNameRaw = noteNameInput.locator('input')
    await noteNameRaw.type("Dummy Note", { delay: 200 })

    //now we need to submit the form
    await submitButton.click()

    //now we need to check the Dummy Folder has one child
    const dummyFolderChildren = dummyFolder.getByTestId(folderChildrenLocator)
    await expect(dummyFolderChildren.locator('> button')).toHaveCount(1)

    //now we need to check the dummy childs child = dummy note
    const dummyNoteLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const dummyNote = dummyFolderChildren.getByTestId(dummyNoteLocator)
    await expect(dummyNote).toContainText("Dummy Note")

    //click on dummyFolder again
    await dummyFolder.locator('button').first().click()

    //now we need to click on buttonZero again
    await buttonZero.click()

    //now we need to get the new chart button and click it
    const newChartButton = page.getByTestId(newChartButtonLocator)
    await newChartButton.click()

    //now we need to check chart-name = New Chart Name
    const chartNameInput = page.getByTestId(chartNameInputLocator)
    await expect(chartNameInput).toContainText("New Chart Name")

    //now we need to type in dummy chart into the input
    const chartNameRaw = chartNameInput.locator('input')
    await chartNameRaw.type('Dummy Chart', { delay: 200 })

    //now we need to submit the form
    await submitButton.click()

    //now we need to see that the dummy folder children has 2 children
    await expect(dummyFolderChildren.locator('> button')).toHaveCount(2)

    //now we need to check that element-1 = Dummy Chart
    const dummyChartLocator = addExtensions(containerElementBase, ["1"])
    const dummyChart = dummyFolderChildren.getByTestId(dummyChartLocator + "::child")
    await expect(dummyChart).toContainText("Dummy Chart")

    //now we need to check viewport-tabs are attached
    const viewportTabs = component.getByTestId(viewportTabsLocator)
    await expect(viewportTabs).toBeAttached()

    //we want to check the viewport-viewport is attached
    const viewportViewport = component.getByTestId(viewportViewportLocator)
    await expect(viewportViewport).toBeAttached()

    //now we need to check that the viewport-tabs has 2 children
    await expect(viewportTabs.locator('> button')).toHaveCount(2)

    //we want to check that viewport-tab-0 = Dummy Note
    const dummyNoteTabLocator = addExtensions(viewportTabBase, ["0"])
    const dummyNoteTab = viewportTabs.getByTestId(dummyNoteTabLocator)
    await expect(dummyNoteTab).toContainText("Dummy Note")

    //we want to check that viewport-tab-1 = Dummy Chart
    const dummyChartTabLocator = addExtensions(viewportTabBase, ["1"])
    const dummyChartTab = viewportTabs.getByTestId(dummyChartTabLocator)
    await expect(dummyChartTab).toContainText("Dummy Chart")

    //we want to check that dummyChartTab is active
    const dummyChartTabValue = await dummyChartTab.getAttribute('data-testValue')
    await expect(dummyChartTabValue).toBe("active")

    //now we want to get the viewportViewport testValue
    const viewportViewportValueChart = await viewportViewport.getAttribute('data-testValue')
    await expect(viewportViewportValueChart).toBe("chart")

    //now we want to click on the note tab
    await dummyNoteTab.click()

    //now we want to check that the dummyNoteTab is active
    const dummyNoteTabValue = await dummyNoteTab.getAttribute('data-testValue')
    await expect(dummyNoteTabValue).toBe("active")

    //we want to check the viewportviewport = note
    const viewportViewportValueNote = await viewportViewport.getAttribute('data-testValue')
    await expect(viewportViewportValueNote).toBe("note")

    //now we click on folder-0 again
    await projectFolder.locator('button').first().click()

    //now we want to check that the delete button is disabled
    const deleteFolderButtonLocator = addExtensions(buttonBase, ["1"])
    const deleteFolderButton = component.getByTestId(deleteFolderButtonLocator)
    await expect(deleteFolderButton).toBeDisabled()

    //now we click on folder-0 again
    await projectFolder.locator('button').first().click()
    //now we want to click on the dummyFolder
    await dummyFolder.locator('button').first().click()

    //now the delete button should not be disabled
    await expect(deleteFolderButton).not.toBeDisabled()

    //now we want to click on the deleteButton
    await deleteFolderButton.click()

    //now we want to check the delete-warning element is attached
    const deleteWarning = page.getByTestId(deleteWarningLocator)
    await expect(deleteWarning).toBeAttached()

    //now we want to check the confirm-checkbox element is attached
    const confirmCheckbox = page.getByTestId(confirmCheckboxLocator)
    await expect(confirmCheckbox).toBeAttached()

    //now we need to check the submit button is disabled
    await expect(submitButton).toHaveAttribute("disabled", "true")

    //now we want to check the checkbox
    const confirmCheckboxRaw = confirmCheckbox.locator('input')
    await confirmCheckboxRaw.click()

    //now we need to check the submit button is not disabled and click it
    await expect(submitButton).not.toHaveAttribute("disabled", "true")
    await submitButton.click()

    //folder-0 has 0 children
    await expect(projectFolderChildren.locator('> div')).toHaveCount(0)
    await expect(projectFolderChildren.locator('> button')).toHaveCount(0)

    //viewport tabs has 0 children
    await expect(viewportTabs.locator('> button')).toHaveCount(2)

    //we need to check if viewportViewport is undefined
    const viewportViewportValueUndefined = await viewportViewport.getAttribute('data-testValue')
    await expect(viewportViewportValueUndefined).toBe("undefined")

    //now we click on folder-0 again
    await projectFolder.locator('button').first().click()

    //click new note button
    await newNoteButton.click()

    //now we want to type in Dummy Note 
    await noteNameRaw.type('Dummy Note', { delay: 200 })

    //now we want to submit the form
    await submitButton.click()

    //now we want to check that viewport-tabs has 1 child
    await expect(viewportTabs.locator('> button')).toHaveCount(1)

    //we want to check viewport-tab-0 is active
    const dummyNoteTabValueTest = await dummyNoteTab.getAttribute('data-testValue')
    await expect(dummyNoteTabValueTest).toBe("active")

    //check if viewportviewport matches
    const viewportNoteMatchTest = await viewportViewport.getAttribute('data-testValue')
    await expect(viewportNoteMatchTest).toBe("note")

    //now we want to close the dummy note
    const dummyNoteTabClose = dummyNoteTab.locator(closeTabLocator)
    await dummyNoteTabClose.click()

    //now viewport-viewport should be undefined
    const viewportNullCheck = await viewportViewport.getAttribute('data-testValue')
    await expect(viewportNullCheck).toBe("undefined")
})