import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../components/ui/quanta-dataset-manager/types'
import { ApplicationTestingWrapper, QuantaContextTestingWrapper } from '../utils'
import IndicatorViewer from '../../components/quanta/indicator-viewer'
import { IQuantaIndicator } from '../../components/quanta/quanta-indicator-manager/types'
import { v4 } from 'uuid'

//here are the locators for the testing spec
const tableHeaderLocatorBase = "indicator-table-h"
const tableItemLocatorBase = "indicator-table-item"

//utility function that add extensions to a locator
const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

//function that generates a dummy quanta indicator
const GenerateDummyIndicator = () => {
    const dummyIndicator: IQuantaIndicator = {
        indicatorId: v4(),
        field: {
            datasetFields: [
                {
                    fieldKey: "demo-field",
                    fieldType: "string",
                    stringField: "demo-value"
                }
            ]
        },

        chartData: [
            { xValue: 0, yValue: 10, isProjection: false },
            { xValue: 1, yValue: 15, isProjection: false },
            { xValue: 2, yValue: 12, isProjection: false },
            { xValue: 3, yValue: 24, isProjection: false },
            { xValue: 4, yValue: 26, isProjection: false },
            { xValue: 5, yValue: 27, isProjection: false },
            { xValue: 6, yValue: 30, isProjection: false }
        ]
    }

    return dummyIndicator
}

test('indicator table mount test', async ({ mount }) => {
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
                <IndicatorViewer />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //now we need to test whether or not the chart title has rendered
    const headerTitleChartLocator = addExtensions(tableHeaderLocatorBase, ["Chart"])
    const headerTitleChart = component.getByTestId(headerTitleChartLocator)
    await expect(headerTitleChart).toContainText("Chart")
    //now we need to test whether or not the chart title type has rendered
    const headerTypeChartLocator = addExtensions(tableHeaderLocatorBase, ["chart"])
    const headerTypeChart = component.getByTestId(headerTypeChartLocator)
    await expect(headerTypeChart).toContainText("chart")
})

test('indicator table dummy test', async ({ mount }) => {
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
            <QuantaContextTestingWrapper data={mockData} dummyIndicators={[GenerateDummyIndicator()]}>
                <IndicatorViewer />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //we need to test if they added the dummy title
    const headerTitleDummyLocator = addExtensions(tableHeaderLocatorBase, ["Demo-field"])
    const headerTitleDummy = component.getByTestId(headerTitleDummyLocator)
    await expect(headerTitleDummy).toContainText("Demo-field")
    //we need to test if they added the dummy type
    const headerTypeDummyLocator = addExtensions(tableHeaderLocatorBase, ["string"])
    const headerTypeDummy = component.getByTestId(headerTypeDummyLocator)
    await expect(headerTypeDummy).toContainText("string")
    //we need to test if the value was put into the table
    const tableDummyValueLocator = addExtensions(tableItemLocatorBase, ["0", "demo-field"])
    const tableDummyValue = component.getByTestId(tableDummyValueLocator)
    await expect(tableDummyValue).toContainText("demo-value")
})