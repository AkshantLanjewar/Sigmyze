import { test, expect } from '@playwright/experimental-ct-react'
import FileTreeView from '../../../components/ui/file-management/file-tree-view'
import { ISigmyzeFilesystem } from '../../../components/ui/file-management/types'
import { ApplicationTestingWrapper } from '../../utils'

/**
 * This file contains all the testing specs in order to make sure the file dropddown viewer works as it was intended in the design phase
 * with this test, all tests should include major styling tests  as well, since those tend to be important
 * 
 * Mount Test
 *  - this make sure the basic elements of the component render
 *  - there is a container with testId = file-dropdown-container
 *  - it has a min width of 200
 * 
 * Folder Mount Test
 *  - the goal of this test is to make sure a folder can be rendered
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - container-element-0 has text = Dummy Folder
 *  - container-element-0 has data-testValue = element-folder
 * 
 * Chart Mount Test
 *  - the goal of this test is to make sure a chart node can be rendered
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - container-element-0 as text = Dummy Chart
 *  - container-element-0 has data-testValue = element-chart
 * 
 * Note Mount Test
 *  - the goal of this test is to make sure a note node can be rendered
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - container-element-0 has text = Dummy Note
 *  - container-element-0 has data-testValue = element-note
 * 
 * Child Mount Test
 *  - the goal of this test is to make sure that folder's can render children
 *  - there is the file-dropdown-container
 *  - it has one child
 *  - container-element-0 has data-testValue = element-folder
 *  - container-element-0 has child child-nodes
 *  - child-nodes has 1 element
 *  - child-nodes->container-element-0::child = Dummy Chart
 *  - child-nodes->container-element-0::child = element-chart
 *  - click on container-element-0
 *  - child-nodes->container-element-0::child is hidden
 * 
 * Locators for Test
 *  - file-dropdown-container: this is the base container for all the rendered nodes in the dropdown
 *  - container-folder-[x]: this is a folder within the dropdown container with x being the index of the folder within the list
 *  - container-element-[x]: this is an element either in the root container or in a folder's children, if it is a child it will have ::child appended to the end
 *  - container-element-[x] data-testValue -> this is the type of node being rendered, ex element-chart, element-folder, element-note, etc...
 *  - folder-children: this is the container where all a folders child nodes will be rendered
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

//here are all the locators for the test
const fileDropdownContainerLocator = "file-dropdown-container"
const folderChildrenLocator = "folder-children"
const containerElementBase = "container-element"
const containerFolderBase = "container-folder"

test('mount test', async ({ mount }) => {
    //we need to make a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Dummy Filesystem",
        folders: [],
        files: [],
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <FileTreeView fileSystem={mockFilesystem} />
        </ApplicationTestingWrapper>
    )

    //make sure the container exists
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    await expect(fileDropdownContainer).toHaveCSS('min-width', '200px')
})

test('folder mount test', async ({ mount }) => {
    //we need to make a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Dummy Filesystem",
        folders: [{
            folderId: "dummy-id",
            folderName: "Dummy Folder",
            folders: [],
            files: []
        }],
        files: [],
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <FileTreeView fileSystem={mockFilesystem} />
        </ApplicationTestingWrapper>
    )

    //make sure the container exists
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //we need to check that the container only has one child
    const fileDropdownContainerChildren = fileDropdownContainer.locator('> div')
    await expect(fileDropdownContainerChildren).toHaveCount(1)
    //we need to get the first child and check it = dummy folder
    const containerZeroLocator = addExtensions(containerFolderBase, ["0"])
    const containerZero = fileDropdownContainer.getByTestId(containerZeroLocator)
    await expect(containerZero).toContainText("Dummy Folder")
    //we need to get the testValue of the folder as well 
    const containerZeroTestValue = await containerZero.getAttribute("data-testValue")
    await expect(containerZeroTestValue).toBe('element-folder')
})

test('chart mount test', async ({ mount }) => {
    //we need to make a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Dummy Filesystem",
        folders: [],
        files: [{
            fileId: "dummy-file",
            fileName: "Dummy Chart",
            fileType: "quanta::chart"
        }],
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <FileTreeView fileSystem={mockFilesystem} />
        </ApplicationTestingWrapper>
    )

    //make sure the container exists
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //we need to check that the container only has one child
    const fileDropdownContainerChildren = fileDropdownContainer.locator('> button')
    await expect(fileDropdownContainerChildren).toHaveCount(1)
    //we need to get the first child and check it = Dummy Chart
    const containerZeroLocator = addExtensions(containerElementBase, ["0"])
    const containerZero = fileDropdownContainer.getByTestId(containerZeroLocator)
    await expect(containerZero).toContainText("Dummy Chart")
    //we need to get the testValue of the file as well 
    const containerZeroTestValue = await containerZero.getAttribute("data-testValue")
    await expect(containerZeroTestValue).toBe('element-chart')

})

test('note mount test', async ({ mount }) => {
    //we need to make a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Dummy Filesystem",
        folders: [],
        files: [{
            fileId: "dummy-file",
            fileName: "Dummy Note",
            fileType: "quanta::note"
        }],
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <FileTreeView fileSystem={mockFilesystem} />
        </ApplicationTestingWrapper>
    )

    //make sure the container exists
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //we need to check the container only has one child
    const fileDropdownContainerChildren = fileDropdownContainer.locator('> button')
    await expect(fileDropdownContainerChildren).toHaveCount(1)
    //we need to get the first child and check it = Dummy Note
    const containerZeroLocator = addExtensions(containerElementBase, ["0"])
    const containerZero = fileDropdownContainer.getByTestId(containerZeroLocator)
    await expect(containerZero).toContainText("Dummy Note")
    //we need to get the testValue of the file as well 
    const containerZeroTestValue = await containerZero.getAttribute("data-testValue")
    await expect(containerZeroTestValue).toBe('element-note')
})

test('child mount test', async ({ mount }) => {
    //we need to make a dummy filesystem
    const mockFilesystem: ISigmyzeFilesystem = {
        name: "Dummy Filesystem",
        files: [],
        folders: [{
            folderId: "dummy-id",
            folderName: "Dummy Folder",
            folders: [],
            openMount: true,
            files: [{
                fileId: "dummy-file",
                fileName: "Dummy Note",
                fileType: "quanta::note"
            }]
        }]
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <FileTreeView fileSystem={mockFilesystem} />
        </ApplicationTestingWrapper>
    )

    //make sure the container exists
    const fileDropdownContainer = component.getByTestId(fileDropdownContainerLocator)
    await expect(fileDropdownContainer).toBeAttached()
    //we need to check that the container only has one child
    const fileDropdownContainerChildren = fileDropdownContainer.locator('> div')
    await expect(fileDropdownContainerChildren).toHaveCount(1)
    //we need to get the first child and check it = dummy folder
    const containerZeroLocator = addExtensions(containerFolderBase, ["0"])
    const containerZero = fileDropdownContainer.getByTestId(containerZeroLocator)
    await expect(containerZero).toContainText("Dummy Folder")
    //we need to get the testValue of the folder as well 
    const containerZeroTestValue = await containerZero.getAttribute("data-testValue")
    await expect(containerZeroTestValue).toBe('element-folder')
    //now we need to check that the folder in container-0 has 1 child
    const containzerZeroChildren = containerZero.getByTestId(folderChildrenLocator)
    await expect(containzerZeroChildren.locator('> button')).toHaveCount(1)
    //now we need to check the child = the note
    const containerChildLocator = addExtensions(containerElementBase, ["0"]) + "::child"
    const containerChild = containzerZeroChildren.getByTestId(containerChildLocator)
    await expect(containerChild).toContainText("Dummy Note")
    //now we need to check the child value is the same
    const containerChildValue = await containerChild.getAttribute('data-testValue')
    await expect(containerChildValue).toBe("element-note")
    //now we want to click on the folder
    await containerZero.click()
})