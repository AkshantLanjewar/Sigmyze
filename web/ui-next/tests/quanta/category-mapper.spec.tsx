import { test, expect } from '@playwright/experimental-ct-react'
import CategoryMapper from '../../components/quanta/category-mapper'
import CategoryUpload from '../../components/quanta/category-mapper/category-upload'
import { ApplicationTestingWrapper, QuantaContextTestingWrapper } from '../utils'
import { IDatasetCacheObject } from '../../components/ui/quanta-dataset-manager/types'
import { createDataTransfer } from 'playwright-utilities'

//here are all the locators that the test can leverage in order to find elements
const buttonLocator = "category-button"
const fileNameLocator = "file-name"
const fileUploadLocator = "file-upload"
const dropdownLocator = "dropdown"
const filetypeLocator = "filetype"
const cancelButtonLocator = "cancel-button"
const submitButtonLocator = "submit-button"

//this is the unit test for the category mapper that tests both filename and filetype
test('category mapper mounts', async ({ mount }) => {
    //this is the mock data we are going to be putting into the context
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
                <CategoryMapper />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )
    
    //we need to check if filename = Upload categories.json
    const filenameComponent = component.getByTestId(fileNameLocator)
    await expect(filenameComponent).toContainText("Upload categories.json")
    //we need to check the filetype = .json file
    const filetypeComponent = component.getByTestId(filetypeLocator)
    await expect(filetypeComponent).toContainText(".json file")
})

//this is the unit test where we upload a dummy categorization object and we want to see the category mapper change
test('category mapper with uploaded file', async ({ mount }) => {
    //this is the mock data going into the context
    const mockData: IDatasetCacheObject = {
        dataset_name: undefined,
        dataset_id: undefined,
        dataset_description: undefined,
        selectors: [],
        textStore: {},
        schemas: [],
        categorization: {
            fileName: "test.filename",
            mapsTo: undefined,
            categories: [],
            categoriesMap: {}
        }
    }

    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={mockData}>
                <CategoryMapper />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //we need to check if filename = Upload categories.json
    const filenameComponent = component.getByTestId(fileNameLocator)
    await expect(filenameComponent).toContainText("test.filename")
})

//this is the unit test for the CategoryUpload component, that aims to test whether or not the components exist
const dropdownCompatMock: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    selectors: [],
    textStore: {},
    schemas: [
        {
            schemaId: "dataset",
            schema: {
                name: "dataset",
                type: "schema",
                children: [
                    {
                        nodeId: "test",
                        name: "test"
                    }
                ]
            }
        }
    ]
}

test('category upload mount test', async ({ mount }) => {
    let closeClicked = false
    const component = await mount(
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={dropdownCompatMock}>
                <CategoryUpload closeModal={() => { closeClicked = true }} />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    )

    //we need to check that the source exists
    const uploadSourceComponent = component.getByTestId(fileUploadLocator)
    await expect(uploadSourceComponent).toContainText('Category Definition')
    //we need to check that the map to field component exists
    const dropdownComponent = component.getByTestId(dropdownLocator)
    await expect(dropdownComponent).toContainText('Map to Field')
    //now we need to check the functionality of the cancel button
    const cancelButtonComponent = component.getByTestId(cancelButtonLocator)
    await cancelButtonComponent.click()
    await expect(closeClicked).toBeTruthy()
})

//now it is time to implement the e2e test 
test('e2e: CategoryMapper uploading categories.json flow', async ({ mount, context, page }) => {
    await context.setExtraHTTPHeaders({
        "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp"
    })

    await page.setExtraHTTPHeaders({
        "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp"
    })

    const component = await mount((
        <ApplicationTestingWrapper>
            <QuantaContextTestingWrapper data={dropdownCompatMock}>
                <CategoryMapper />
            </QuantaContextTestingWrapper>
        </ApplicationTestingWrapper>
    ))

    //we need to first click the upload button
    const categoryButton = component.getByTestId(buttonLocator)
    await categoryButton.click()
    //now we need to upload an example categories.json file 
    await page.setInputFiles("input[type='file']", {
        name: "test.json",
        mimeType: "text/json",
        buffer: Buffer.from('{"swag": []}')
    })
    //now we submit the form
    const submitButton = page.getByTestId(submitButtonLocator)
    await submitButton.click()

    //now we need to validate whether or not the title includes test.json
    const fileName = component.getByTestId(fileNameLocator)
    await expect(fileName).toContainText('categories.json')
})