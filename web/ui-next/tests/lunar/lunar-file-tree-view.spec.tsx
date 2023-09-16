import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'
import LunarRefresh from '../../components/lunar-refresh/page'
import { ISigmyzeFilesystem } from '../../components/ui/file-management/types'

/**
 * The goal of theese tests will to be to ensure that the FileTreeViewer UI component
 * is able to successfully integrate into the new lunar page.
 * 
 * unlike the file-tree tests, this test will also test integration, so underlying factors such as any context
 * will be tested as well, through the flow validation and integration testing
 * 
 * Mount Integration test
 *  - the goal of this test is to make sure the file-tree viewer integrates into the lunar page on a surface level
 *  - sidepanel is attatched
 *  - sidepanel-title = Explorer
 *  - there is the file-dropdown-container
 *  - it has two children
 *  - container-folder-0 = Dummy Folder
 *  - container-element-0 has data-testValue = element-chart
 * 
 * File Tree Active Validation Test
 *  - the goal of this test is to make sure that active nodes can be selected in the file tree, and the active node effects what portal buttons are being displayed
 *  - there is the file-dropdown-container
 *  - it has two children
 *  - container-folder-0 has data-testValue = element-folder
 *  - container-element-0 has data-testValue = element-chart
 *  - click on container-folder-0
 *  - there is a portal section within the toolbar
 *  - there are two buttons 
 *  - button-0 has icon with testId = folder-create
 *      - validate new-folder
 *      - validate new-note
 *      - validate new-chart
 *  - button-1 has icon with testId = folder-delete
 *  - click on container-element-0
 *  - there is a portal section
 *  - there are 3 buttons
 *  - button-0 has icon with testId = chart-add
 *  - button-1 has icon with testId = chart-settings
 *  - button-2 has icon with testId = chart-remove
 * 
 * Default Project Mount Test
 *  - this will show how a default project would look like
 *  - filesystem (what the filesystem should look like, not the actual project)
 *  - folders
 *      - folderId: lunar-project
 *      - folderName: "Untitled Project"
 *  - validate there is the file container
 *  - it has one child
 *  - the folder-0 = Untitled Project
 * 
 * Folder Creation Flow Validation
 *  - this will show how to create a new folder 
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - click on child (it is folder)
 *  - get folder-create button
 *  - click folder-create button
 *  - page get new folder button
 *  - validate that folder-name = New Folder Name
 *  - type in Dummy Folder
 *  - hit the submit button
 *  - go back to folder-0
 *  - it should have one child
 *  - folder-0::child = Dummy Folder
 * 
 * Note Creation Flow Validation
 *  - this will show how to create a new note
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - click on child (it is folder)
 *  - get folder-create button
 *  - click folder-create button
 *  - page get new note button
 *  - validate that note-name = New Note Name
 *  - type in Dummy Note
 * - hit the submit button
 *  - go back to folder-0
 *  - it should have one child
 *  - elementr-0::child = Dummy Note
 * 
 * Chart Creation Flow Validation
 *  - this will show how to create a new chart
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - click on child (it is folder)
 *  - get folder-create button
 *  - click folder-create button
 *  - page get new chart button
 *  - validate that chart-name = New Chart Name
 *  - type in Dummy Chart
 *  - hit the submit button
 *  - go back to folder-0
 *  - it should have one child
 *  - element-0::child = Dummy Chart
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

//here are all the locators for the followings tests with their descriptions

/**
 * this is the sidepanel in the general Lunar screen space
 */
const sidepanelLocator = "sidepanel"

/**
 * this is the title for the sidepanel
 */
const sidepanelTitleLocator = "sidepanel-title"

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
 * this is the testId for the icon within the chart-add button
 */
const chartAddLocator = "chart-add"

/**
 * this is the testId for the icon within the chart-settings portal button
 */
const chartSettingsLocator = "chart-settings"

/**
 * this is the testId for the icon within the chart-remove portal button
 */
const chartRemoveLocator = "chart-remove"

/**
 * this is the testId for the icon within the note-setting portal button
 */
const noteSettingLocator = "note-setting"

/**
 * this is the testId for the icon within the note-delete portal button
 */
const noteDeleteLocator = "note-delete"

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

test('Lunar File Tree Mount Integration Test', async ({ mount }) => {
    //for testing purposes we will be inserting a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Mock Filesystem",
        folders: [{
            folderId: 'dummy-folder',
            folderName: "Dummy Folder",
            folders: [],
            files: []
        }],
        files: [{
            fileId: "dummy-file",
            fileName: "Dummy Chart",
            fileType: "quanta::chart"
        }]
    }
    
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh mockFilesystem={mockFilesystem} />
        </MemoryRouterProvider>
    )

    //we need to first check the sidepanel is attached
    const sidepanel = component.getByTestId(sidepanelLocator)
    await expect(sidepanel).toBeAttached()
    //now we need to check the sidepanel-title = Explorer
    const sidepanelTitle = sidepanel.getByTestId(sidepanelTitleLocator)
    await expect(sidepanelTitle).toContainText("Explorer")
    //now we need to check that the file-dropdown-container is attached
    const fileDropdownContainer = sidepanel.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //now we need to check that there is one folder
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    //now we need to check that there is one file attached
    const fileDropdownFiles = fileDropdownContainer.locator('> button')
    await expect(fileDropdownFiles).toHaveCount(1)
    //now we need to check the first folder = Dummy Folder
    const containerFolderZeroLocator = addExtensions(containerFolderBase, ["0"])
    const containerFolderZero = fileDropdownContainer.getByTestId(containerFolderZeroLocator)
    await expect(containerFolderZero).toContainText("Dummy Folder")
    //now we need to check the first file has data-testValue = element-chart
    const containerElementZeroLocator = addExtensions(containerElementBase, ["0"])
    const containerElementZero = fileDropdownContainer.getByTestId(containerElementZeroLocator)
    //now we need to get the test value and validate it
    const containerElementZeroTestVal = await containerElementZero.getAttribute("data-testValue")
    await expect(containerElementZeroTestVal).toBe("element-chart")
})

test('Lunar File Tree Active Node Validation test', async ({ mount, page }) => {
    //for testing purposes we will be inserting a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Mock Filesystem",
        folders: [{
            folderId: 'dummy-folder',
            folderName: "Dummy Folder",
            folders: [],
            files: []
        }],
        files: [
            {
                fileId: "dummy-file",
                fileName: "Dummy Chart",
                fileType: "quanta::chart"
            },
            {
                fileId: 'dummy-note',
                fileName: "Dummy Note",
                fileType: "quanta::note"
            }
        ]
    }

    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh mockFilesystem={mockFilesystem} />
        </MemoryRouterProvider>
    ) 
    
    //we need to first check the sidepanel is attached
    const sidepanel = component.getByTestId(sidepanelLocator)
    await expect(sidepanel).toBeAttached()
    //now we need to check that the file-dropdown-container is attached
    const fileDropdownContainer = sidepanel.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //now we need to check that there is one folder
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    //now we need to check that there are 2 file children
    const fileDropdownFiles = fileDropdownContainer.locator('> button')
    await expect(fileDropdownFiles).toHaveCount(2)
    //now we want to check the first component we are clicking on is actually rendered as a folder
    const folderZeroLocator = addExtensions(containerFolderBase, ["0"])
    const folderZero = fileDropdownContainer.getByTestId(folderZeroLocator)
    const folderZeroValue = await folderZero.getAttribute('data-testValue')
    await expect(folderZeroValue).toBe('element-folder')
    //now we want to click on that folder and validate that we have the correct portal buttons showing up
    await folderZero.click()
    //now let us validate that the correct portal buttons are being displayed (2 for folder)
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal.locator('> button')).toHaveCount(2)
    //now we need to validate that button-0 has icon with folder-create
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    //now we need to validate that folder create is attached to button-zero
    const folderCreate = buttonZero.getByTestId(folderCreateLocator)
    await expect(folderCreate).toBeAttached()
    await folderCreate.click()
    //now we need to validate the submenu items for the folder-create button portal
    const folderCreateMenu = page.getByTestId(folderCreateMenuContainer)
    await expect(folderCreateMenu.locator('> button')).toHaveCount(3)
    //now we need to validate that new-folder = New Folder
    const folderCreateMenuNewFolder = folderCreateMenu.getByTestId(newFolderButtonLocator)
    await expect(folderCreateMenuNewFolder).toContainText("New Folder")
    //now we need to validate that new-note = New Note
    const folderCreateMenuNewNote = folderCreateMenu.getByTestId(newNoteButtonLocator)
    await expect(folderCreateMenuNewNote).toContainText("New Note")
    //now we need to validate that new-chart = New Chart
    const folderCreateMenuNewChart = folderCreateMenu.getByTestId(newChartButtonLocator)
    await expect(folderCreateMenuNewChart).toContainText("New Chart")
    //now we need to check that button-1 has a component with testId = folder-delete
    const buttonOneLocator = addExtensions(buttonBase, ["1"])
    const buttonOne = buttonPortal.getByTestId(buttonOneLocator)
    //now we need to validate that the folder-delete is attached
    const folderDelete = buttonOne.getByTestId(folderDeleteLocator)
    await expect(folderDelete).toBeAttached()
    //we have finished validating the folder, let us now validate the chart and its portal components
    const elementZeroLocator = addExtensions(containerElementBase, ["0"])
    const elementZero = fileDropdownContainer.getByTestId(elementZeroLocator)
    //close the menu
    await folderCreate.click()
    //now we need to check if the element is indeed an element-chart
    const elementZeroValue = await elementZero.getAttribute('data-testValue')
    await expect(elementZeroValue).toBe("element-chart")
    await elementZero.click()
    //now we need to validate that there are 3 buttons in the button portal
    await expect(buttonPortal.locator('> button')).toHaveCount(3)
    //now we need to check button-0 has chart-add attached
    const chartButtonZero = buttonPortal.getByTestId(buttonZeroLocator)
    const chartAdd = chartButtonZero.getByTestId(chartAddLocator)
    await expect(chartAdd).toBeAttached()
    //now we need to check button-1 has chart-settings attached
    const chartButtonOne = buttonPortal.getByTestId(buttonOneLocator)
    const chartSettings = chartButtonOne.getByTestId(chartSettingsLocator)
    await expect(chartSettings).toBeAttached()
    //we need to check that button two has chart-remove attached
    const buttonTwoLocator = addExtensions(buttonBase, ["2"])
    const chartButtonTwo = buttonPortal.getByTestId(buttonTwoLocator)
    const chartRemove = chartButtonTwo.getByTestId(chartRemoveLocator)
    await expect(chartRemove).toBeAttached()
    //now let us validate the last element, the note and its portal buttons
    const elementOneLocator = addExtensions(containerElementBase, ["1"])
    const elementOne = fileDropdownContainer.getByTestId(elementOneLocator)
    //now we need to check if it is an element-note
    const elementOneValue = await elementOne.getAttribute('data-testValue')
    await expect(elementOneValue).toBe('element-note')
    //now click on the note
    await elementOne.click()
    //now we need to validate there are 2 buttons 
    await expect(buttonPortal.locator('> button')).toHaveCount(2)
    //we need to check button-0 has note-setting attached
    const noteButtonZero = buttonPortal.getByTestId(buttonZeroLocator)
    const noteSetting = noteButtonZero.getByTestId(noteSettingLocator)
    await expect(noteSetting).toBeAttached()
    //we need to check button-1 has note-delete attached
    const noteButtonOne = buttonPortal.getByTestId(buttonOneLocator)
    const noteDelete = noteButtonOne.getByTestId(noteDeleteLocator)
    await expect(noteDelete).toBeAttached()
})

test('default project mount test', async ({ mount }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )
    
    //we need to first check the sidepanel is attached
    const sidepanel = component.getByTestId(sidepanelLocator)
    await expect(sidepanel).toBeAttached()
    //now we need to check that the file-dropdown-container is attached
    const fileDropdownContainer = sidepanel.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //now we need to check that there is one folder
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    //now we need to check folder-0 = Untitled Project
    const folderZeroLocator = addExtensions(containerFolderBase, ["0"])
    const folderZero = fileDropdownContainer.getByTestId(folderZeroLocator)
    await expect(folderZero).toContainText("Untitled Project")
})

test('Folder Creation Flow Integration Test', async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //now we need to check that the file-dropdown-container is attached
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //now we need to check that there is one folder
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    //now we need to check folder-0 = Demo Project
    const folderZeroLocator = addExtensions(containerFolderBase, ["0"])
    const folderZero = fileDropdownContainer.getByTestId(folderZeroLocator)
    await folderZero.click()
    //we need to check the folder has no children
    const folderZeroChildren = folderZero.getByTestId(folderChildrenLocator)
    await expect(folderZeroChildren.locator('> div')).toHaveCount(0)
    //now we need to get the button-0 so we can activate the new folder flow
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await buttonZero.click()
    //now we need the folder create button to activate the modal
    const folderCreateMenu = page.getByTestId(folderCreateMenuContainer)
    const newFolderButton = folderCreateMenu.getByTestId(newFolderButtonLocator)
    await newFolderButton.click()
    //now we need to validate the form input folder-name = New Folder Name
    const folderNameInput = page.getByTestId(folderNameInputLocator)
    await expect(folderNameInput).toContainText("New Folder Name")
    //let us type in dummy folder within the input
    const folderNameRaw = folderNameInput.locator('input')
    await folderNameRaw.type("Dummy Folder", { delay: 200 })
    //now we need to submit the folder
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()
    //now we need to check that folder-0 has 1 child
    await expect(folderZeroChildren.locator('> div')).toHaveCount(1)
    //now we need to check folderZeroLocator + "::child" = Dummy Folder
    const folderZeroChildLocator = folderZeroLocator + "::child"
    const folderZeroChild = folderZeroChildren.getByTestId(folderZeroChildLocator)
    await expect(folderZeroChild).toContainText("Dummy Folder")
})

test('Note Creation Flow Validation Test', async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //now we need to check that the file-dropdown-container is attached
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //now we need to check that there is one folder
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    //now we need to check folder-0 = Demo Project
    const folderZeroLocator = addExtensions(containerFolderBase, ["0"])
    const folderZero = fileDropdownContainer.getByTestId(folderZeroLocator)
    await folderZero.click()
    //we need to check the folder has no children
    const folderZeroChildren = folderZero.getByTestId(folderChildrenLocator)
    await expect(folderZeroChildren.locator('> div')).toHaveCount(0)
    //now we need to get the button-0 so we can activate the new folder flow
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await buttonZero.click()
    //now we get the new note button
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
    //now we need to check that folder-0 has 1 child
    await expect(folderZeroChildren.locator('> button')).toHaveCount(1)
    //now we need to check the child element is Dummy Folder
    const elementZeroLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const elementZero = folderZeroChildren.getByTestId(elementZeroLocator)
    await expect(elementZero).toContainText("Dummy Note")
})

test('Chart Creation Flow Validation Test', async ({ mount, page }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //now we need to check that the file-dropdown-container is attached
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //now we need to check that there is one folder
    const fileDropdownFolders = fileDropdownContainer.locator('> div')
    await expect(fileDropdownFolders).toHaveCount(1)
    //now we need to check folder-0 = Demo Project
    const folderZeroLocator = addExtensions(containerFolderBase, ["0"])
    const folderZero = fileDropdownContainer.getByTestId(folderZeroLocator)
    await folderZero.click()
    //we need to check the folder has no children
    const folderZeroChildren = folderZero.getByTestId(folderChildrenLocator)
    await expect(folderZeroChildren.locator('> div')).toHaveCount(0)
    //now we need to get the button-0 so we can activate the new folder flow
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
    await expect(folderZeroChildren.locator('> button')).toHaveCount(1)
    //now we need to check the child element is Dummy Chart
    const elementZeroLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const elementZero = folderZeroChildren.getByTestId(elementZeroLocator)
    await expect(elementZero).toContainText("Dummy Chart")
})