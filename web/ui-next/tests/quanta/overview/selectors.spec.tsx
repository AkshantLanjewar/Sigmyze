import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'
import { ApplicationTestingWrapper, QuantaContextTestingWrapper } from '../../utils'
import OverviewSelectors from '../../../components/quanta/overview-selectors/overview-selectors'

//here are the locators for the selector spec
const selectorNameLocator = "selector-name"
const selectorIdLocator = "selector-id"
const selectorContainerLocator = "selector-container"
const createButtonLocator = "create-selector-button"

test('overview-selectors mount', async ({ mount }) => {
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
                <OverviewSelectors />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //validate that Create Selector displays
    const createButton = component.getByTestId(createButtonLocator)
    await expect(createButton).toContainText("Create Selector")
})

test('overview-selectors dummy data mount', async ({ mount }) => {
    const mockData: IDatasetCacheObject = {
        categorization: undefined,
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        textStore: {},
        schemas: [],
        selectors: [
            {
                selectorId: "demo-id",
                selectorName: "demo-selector",
                selectorDescription: "demo-desc"
            }
        ]
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <OverviewSelectors />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //now we check if the demo selector was rendered
    const overviewContainer = component.getByTestId(selectorContainerLocator)
    await expect(overviewContainer).toContainText("demo-selector")
})

test('e2e: overview-selectors e2e creation test', async ({ mount, page }) => {
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
                <OverviewSelectors />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //click the create selector button
    const createButton = component.getByTestId(createButtonLocator)
    await createButton.click()
    //now we need to fill in the new selector data
    const selectorNameContainer = page.getByTestId(selectorNameLocator)
    await selectorNameContainer.getByTestId(`${selectorNameLocator}-input`).type('demo-test', { delay: 200 })

    const selectorIdContainer = page.getByTestId(selectorIdLocator)
    await selectorIdContainer.getByTestId(`${selectorIdLocator}-input`).type('selector-id-test', { delay: 200 })
    //click the submit button
    const submitButton = page.getByTestId("submit-button")
    await submitButton.click()
    //check if the component has rendered
    const overviewContainer = component.getByTestId(selectorContainerLocator)
    await expect(overviewContainer).toContainText("demo-test")
})