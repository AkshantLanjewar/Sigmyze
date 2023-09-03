import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../components/ui/quanta-dataset-manager/types'
import { SelectorPaneTestingWrapper } from '../utils'
import SelectorCodeUpload from '../../components/quanta/selector-code-upload'
import { IQuantaSelectorCode } from '../../components/data/quanta/types/project'

//here are the locators for the test
const uploadButtonLocator = "upload-button"
const codeTitleLocator = "code-title"
const sourceInputLocator = "source-input"

const mockData: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    textStore: {},
    schemas: [],
    selectors: [{
        selectorId: 'dummy-selector',
        selectorName: "Dummy Selector",
        selectorCode: undefined
    }]
}

test('selector-code-upload mount test', async ({ mount }) => {
    const component = await mount(
        <SelectorPaneTestingWrapper
            selectorId='dummy-selector'
            data={mockData}
        >
            <SelectorCodeUpload />
        </SelectorPaneTestingWrapper>
    )

    //we need to check if code-title = Upload Source Code
    const codeTitle = component.getByTestId(codeTitleLocator)
    await expect(codeTitle).toContainText("Upload Source Code")
})

const mockDummyData: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    textStore: {},
    schemas: [],
    selectors: [{
        selectorId: 'dummy-selector',
        selectorName: "Dummy Selector"
    }]
}

test('selector-code-upload dummy test', async ({ mount }) => {
    const dummySelectorCode: IQuantaSelectorCode = {
        containerId: "",
        schemaId: "",
        schemaName: "Dummy Name",
        schemaItems: [],
        sourceCode: "",
        defaultValue: ""
    }

    const component = await mount(
        <SelectorPaneTestingWrapper
            selectorId='dummy-selector'
            data={mockDummyData}
            extSelectorCode={dummySelectorCode}
        >
            <SelectorCodeUpload />
        </SelectorPaneTestingWrapper>
    )

    //we need to check if code-title = Dummy Name
    const codeTitle = component.getByTestId(codeTitleLocator)
    await expect(codeTitle).toContainText("Dummy Name")
})

test('E2E Integration: selector-code-upload integration test', async ({ mount, page }) => {
    const component = await mount(
        <SelectorPaneTestingWrapper
            selectorId='dummy-selector'
            data={mockData}
        >
            <SelectorCodeUpload />
        </SelectorPaneTestingWrapper>
    )

    //we need to check if code-title = Upload Source Code
    const codeTitle = component.getByTestId(codeTitleLocator)
    await expect(codeTitle).toContainText("Upload Source Code")
    //now we need to get the button and click on it
    const uploadButton = component.getByTestId(uploadButtonLocator)
    await uploadButton.click()
    await page.waitForTimeout(750)
    //now we need to validate the form component = Source Code
    const sourceInput = page.getByTestId(sourceInputLocator)
    await expect(sourceInput).toContainText("Source Code")
})