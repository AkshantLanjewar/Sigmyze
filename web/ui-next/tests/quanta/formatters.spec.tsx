import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../components/ui/quanta-dataset-manager/types'
import { ApplicationTestingWrapper, QuantaContextTestingWrapper } from '../utils'
import Formatters from '../../components/quanta/formatters'
import FormatterPreview from '../../components/quanta/formatters/preview'

//here are all the locators for the testing spec
const titleInputLocator = "indicator-title-input"
const shortInputLocator = "indicator-short-input"
const titleValueLocator = "preview-title"
const shortValueLocator = "preview-short"

test('formatters component mount unit test', async ({ mount }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: []
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <Formatters />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //now we need to test the title input
    const titleInput = component.getByTestId(titleInputLocator)
    await expect(titleInput).toContainText("Indicator Title")
    //now we need to test the short input
    const shortInput = component.getByTestId(shortInputLocator)
    await expect(shortInput).toContainText("Short Title")
})

test('formatter preview component mount test', async ({ mount }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: []
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <Formatters />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //since there is no input value we need to detect the title has been rendered
    const previewTitle = component.getByTestId(titleValueLocator)
    await expect(previewTitle).toContainText("Type value in Title Text Field")
    //since there is no short input value we need to detect the short title has rendered
    const shortTitle = component.getByTestId(shortValueLocator)
    await expect(shortTitle).toContainText("Type value in Short Text Field")
})

test('formatter preview component mocked data test', async ({ mount }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        schemas: [],
        textStore: {
            "formatter::title": "title-test",
            "formatter::short": "short-test"
        },
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <Formatters />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //now we need to test for the input value's we had put into the context and check if they match up
    const previewTitle = component.getByTestId(titleValueLocator)
    await expect(previewTitle).toContainText("title-test")
    //now we need to test the short value
    const shortTitle = component.getByTestId(shortValueLocator)
    await expect(shortTitle).toContainText("short-test")
})

//this is the e2e test
test('formatters e2e test', async ({ mount }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        schemas: [],
        textStore: {
            "formatter::title": "title-test",
            "formatter::short": "short-test"
        },
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <Formatters />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //now we need to change the vaue of the preview 
    const titleInput = component.getByTestId(titleInputLocator)
    await titleInput.locator("input").type('new-test-value')
    //now changing the value of the preview short
    const shortInput = component.getByTestId(shortInputLocator)
    await shortInput.locator('input').type('new-short-value')

    //now we need to validate the results
    const previewTitle = component.getByTestId(titleValueLocator)
    await expect(previewTitle).toContainText("new-test-value")
    //now we need to test the short value
    const shortTitle = component.getByTestId(shortValueLocator)
    await expect(shortTitle).toContainText("new-short-value")
})