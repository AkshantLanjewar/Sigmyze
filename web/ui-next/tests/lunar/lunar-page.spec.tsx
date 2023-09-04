import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-13'
import LunarRefresh from '../../components/lunar-refresh/page'

/**
 * this file contains all the testing specs in order to ensure that the Lunar Refresh page matches correctly
 *  
 * the first set of tests will be concerned with the validation of the sidebar component within the page, and whether or not it can change
 * it's button state in order to display the correct set of sidebar buttons
 *  
 * Sidebar Validation tests
 *  - mount test (this test is concerned with making sure the folder buttons are shown)
 *  - folder portal setting test
 *  - chart portal setting test
 *  - note portal setting test
 *  - change portal setting test
 * 
 * Folder Buttons Shown 
 *  - there is a portal section within the toolbar
 *  - there are two buttons 
 *  - button-0 has icon with testId = folder-create
 *  - button-1 has icon with testId = folder-delete
 *  
 * Chart Buttons Shown
 *  - there is a portal section
 *  - there are 3 buttons
 *  - button-0 has icon with testId = chart-add
 *  - button-1 has icon with testId = chart-settings
 *  - button-2 has icon with testId = chart-remove
 * 
 * Note Buttons Shown
 *  - there is a portal section
 *  - there are 2 buttons
 *  - button-0 = note-setting
 *  - button-1 = note-delete
 * 
 * Now the Testing spec has been completed, here are the only locators allowed to fullfill the test
 *  - button-portal -> this is the div where all the buttons in the portal are located
 *  - button-[x] -> this is the button locator, where [x] = the button's index in the list of rendered buttons
 *  - folder-create -> this is the testId placed upon the icon within the craete folder button in the portal
 *  - folder-delete -> this is the testId placed upon the icon within the folder delete button
 *  - chart-add
 *  - chart-settings
 *  - chart-remove
 *  - note-setting
 *  - note-delete
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

//here are all the locators for the testing spec
const buttonPortalLocator = "button-portal"
const buttonBase = "button"
//theese are the locators for the folder portal buttons
const folderCreateLocator = "folder-create"
const folderDeleteLocator = "folder-delete"
//theese are the locators for the chart portal buttons
const chartAddLocator = "chart-add"
const chartSettingsLocator = "chart-settings"
const chartRemoveLocator = "chart-remove"
//theese are the locators for the note portal buttons
const noteSettingLocator = "note-setting"
const noteDeleteLocator = "note-delete"

test('Lunar Page mount test', async ({ mount }) => {
    const component = await mount (
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh />
        </MemoryRouterProvider>
    )

    //we need to check if the portal area exists
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal).toBeAttached()
})

test('Lunar Page folder-portal test', async ({ mount }) => {
    const component = await mount(
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh testingPortal='folder' />
        </MemoryRouterProvider>
    )

    //we need to check if the portal area exists
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal).toBeAttached()
    //now we need to validate that button-0 = folder-create attached
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await expect(await buttonZero.locator('svg').getAttribute('data-testId')).toBe(folderCreateLocator)
    //now we need to validate that button-1 = folder-delete
    const buttonOneLocator = addExtensions(buttonBase, ["1"])
    const buttonOne = buttonPortal.getByTestId(buttonOneLocator)
    await expect(await buttonOne.locator('svg').getAttribute('data-testId')).toBe(folderDeleteLocator)
})

test('Lunar Page chart-portal test', async ({ mount }) => {
    const component = await mount(
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh testingPortal='chart' />
        </MemoryRouterProvider>
    )

    //we need to check if the portal area exists
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal).toBeAttached()
    //now we need to validate that button-0 = chart-add attached
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await expect(await buttonZero.locator('svg').getAttribute('data-testId')).toBe(chartAddLocator)
    //we need to validate that button-1 = chart-settings attached
    const buttonOneLocator = addExtensions(buttonBase, ["1"])
    const buttonOne = buttonPortal.getByTestId(buttonOneLocator)
    await expect(await buttonOne.locator('svg').getAttribute('data-testId')).toBe(chartSettingsLocator)
    //we need to validate that button-2 = chart-remove attached
    const buttonTwoLocator = addExtensions(buttonBase, ["2"])
    const buttonTwo = buttonPortal.getByTestId(buttonTwoLocator)
    await expect(await buttonTwo.locator('svg').getAttribute('data-testId')).toBe(chartRemoveLocator)
})

test('Lunar Page note-portal test', async ({ mount }) => {
    const component = await mount(
        <MemoryRouterProvider url={'/lunar'}>
            <LunarRefresh testingPortal='note' />
        </MemoryRouterProvider>
    )    

    //we need to check if the portal area exists
    const buttonPortal = component.getByTestId(buttonPortalLocator)
    await expect(buttonPortal).toBeAttached()
    //now we need to validate that button-0 = note-setting
    const buttonZeroLocator = addExtensions(buttonBase, ["0"])
    const buttonZero = buttonPortal.getByTestId(buttonZeroLocator)
    await expect(await buttonZero.locator('svg').getAttribute('data-testId')).toBe(noteSettingLocator)
    //now we need to validate that button-1 = note-delete
    const buttonOneLocator = addExtensions(buttonBase, ["1"])
    const buttonOne = buttonPortal.getByTestId(buttonOneLocator)
    await expect(await buttonOne.locator('svg').getAttribute('data-testId')).toBe(noteDeleteLocator)
})