import { test, expect } from '@playwright/experimental-ct-react'
import { IDatasetCacheObject } from '../../../components/ui/quanta-dataset-manager/types'
import { IQuantaEditorProject } from '../../../components/data/quanta/types/project'
import { BuildNode } from '../../../components/quanta/quanta-editor/utils'
import { ApplicationTestingWrapper, QuantaEditorTestingWrapper } from '../../utils'
import { IconFileCode2 } from '@tabler/icons'
import PREBUILT_FORMS from '../../../components/ui/form-builder/prebuilt_forms'
import { IQuantaStore } from '../../../components/quanta/quanta-editor/types/store'

//here are the locators for the testing spec
const nodeTitleLocator = "node-title"
const outputLocator = "outputs"
const outputBase = "output"
const inputsLocator = "inputs"
const inputLocatorBase = "input"
const outputGroupTitleLocator = "output-group-title"
const outputGroupChildrenLocator = "output-group-children"
const controlsLocators = "controls"
const controlLocatorBase = "control"
const inputTypeLocator = "input-type"
//here are the locators for the forms
const newFileNameLocator = "new-file-name"
const newFileTypeLocator = "new-file-type"
const submitButtonLocator = "submit-button"

//utility function that add extensions to a locator
const addExtensions = (base: string, extensions: string[]) => {
    let outputString = base
    for(let i = 0; i < extensions.length; i++) {
        let extension = extensions[i]
        outputString += `-${extension}`
    }

    return outputString
}

const mockData: IDatasetCacheObject = {
    categorization: undefined,
    dataset_name: undefined,
    dataset_id: undefined,
    dataset_description: undefined,
    selectors: [],
    textStore: {},
    schemas: []
}

test('file-upload mount test', async ({ mount }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("file_upload")!
        ],
    }

    const component = await mount(
        <div style={{ width: "100vw", height: "100vh" }}>
            <ApplicationTestingWrapper>
                <QuantaEditorTestingWrapper data={mockData} editorData={mockEditorData}>
                </QuantaEditorTestingWrapper>
            </ApplicationTestingWrapper>
        </div>
    )

    //test the title
    const nodeTitle = component.getByTestId(nodeTitleLocator)
    await expect(nodeTitle).toContainText("File Upload")
    //we need to find the input blocks
    const inputs = component.getByTestId(inputsLocator)
    await expect(inputs.locator('> div')).toHaveCount(1)
    //we need to get the first input, execution thread
    const executionThreadLocator = addExtensions(inputLocatorBase, ["0"])
    const executionThread = inputs.getByTestId(executionThreadLocator)
    await expect(executionThread).toContainText("Execution Thread")
    //now we want to check that the execution thread type is hidden
    const threadType = executionThread.getByTestId(inputTypeLocator)
    await expect(threadType).toBeEmpty()
    //now we need to check the output blocks
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //we need to get the first output block and check if its a group
    const fileOutputBlockLocator = addExtensions(outputBase, ["0"])
    const fileOutputBlock = outputs.getByTestId(fileOutputBlockLocator)
    //now we need to get the input title and check it
    const fileOutputTitle = fileOutputBlock.getByTestId(outputGroupTitleLocator)
    await expect(fileOutputTitle).toContainText("Files")
    //check there are 0 group children
    const fileOutputChildren = fileOutputBlock.getByTestId(outputGroupChildrenLocator)
    await expect(fileOutputChildren.locator('> div')).toHaveCount(0)
    //now we need to check there is only 1 control button
    const controls = component.getByTestId(controlsLocators)
    await expect(controls.locator('> div')).toHaveCount(1)
    //we need to check the first control = Add File
    const addFileControlLocator = addExtensions(controlLocatorBase, ["0"])
    const addFileControl = controls.getByTestId(addFileControlLocator)
    await expect(addFileControl).toContainText("Add File")
})

test('file-upload mock data test', async ({ mount, page }) => {
    const fileUploadNode = BuildNode("file_upload")!
    const dataObject = {
        name: "Dummy File",
        type: { groupId: "files", typeId: "xsd" },
        icon: <IconFileCode2 />
    }

    const storeKey = `${fileUploadNode.data?.nodeId}_file_upload`
    let quantaStore = {} as IQuantaStore
    quantaStore[storeKey] = {
        name: "file upload store",
        form: PREBUILT_FORMS.createFile,
        formTitle: "demo title",
        items: [{
            data: undefined,
            addedKeys: ["name", "type", "icon"],
            frozenData: JSON.stringify(dataObject)
        }]
    }

    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        executionResults: [],
        nodes: [ fileUploadNode ],
        quantaStore: quantaStore
    }

    const component = await mount(
        <div style={{ width: "100vw", height: "100vh" }}>
            <ApplicationTestingWrapper>
                <QuantaEditorTestingWrapper data={mockData} editorData={mockEditorData}>
                </QuantaEditorTestingWrapper>
            </ApplicationTestingWrapper>
        </div>
    )

    //now we need to check the output blocks
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //we need to get the first output block and check if its a group
    const fileOutputBlockLocator = addExtensions(outputBase, ["0"])
    const fileOutputBlock = outputs.getByTestId(fileOutputBlockLocator)
    //check there are 0 group children
    const fileOutputChildren = fileOutputBlock.getByTestId(outputGroupChildrenLocator)
    await expect(fileOutputChildren.locator('> div')).toHaveCount(1)
    //now we want to get the child and check the title
    const fileChild = fileOutputChildren.getByTestId(fileOutputBlockLocator + "::child")
    await expect(fileChild).toContainText("Dummy File")
})

test('E2E: file-upload integration test', async ({ mount, page }) => {
    const mockEditorData: IQuantaEditorProject = {
        fileId: "ruckus",
        edges: [],
        quantaStore: {},
        executionResults: [],
        nodes: [
            BuildNode("file_upload")!
        ],
    }

    const component = await mount(
        <div style={{ width: "100vw", height: "100vh" }}>
            <ApplicationTestingWrapper>
                <QuantaEditorTestingWrapper data={mockData} editorData={mockEditorData}>
                </QuantaEditorTestingWrapper>
            </ApplicationTestingWrapper>
        </div>
    )

    //now we need to check there is only 1 control button
    const controls = component.getByTestId(controlsLocators)
    await expect(controls.locator('> div')).toHaveCount(1)
    //we need to check the first control = Add File
    const addFileControlLocator = addExtensions(controlLocatorBase, ["0"])
    const addFileControl = controls.getByTestId(addFileControlLocator)
    await expect(addFileControl).toContainText("Add File")
    //now we click the file control and validate the modal has been created
    await addFileControl.click()
    //now we need to get the new file name and validate its value
    const newFileName = page.getByTestId(newFileNameLocator)
    await expect(newFileName).toContainText("File Name")
    //new we need to validate the file type form field
    const newFileType = page.getByTestId(newFileTypeLocator)
    await expect(newFileType).toContainText("File Type")
    //now we need to type in the dummy file name value
    const newFileInput = newFileName.locator('input').first()
    await newFileInput.type("Dummy File", { delay: 200 })
    //now we need to get the submit button and submit the form
    const submitButton = page.getByTestId(submitButtonLocator).first()
    await submitButton.click()
    //now we need to check the output blocks
    const outputs = component.getByTestId(outputLocator)
    await expect(outputs.locator('> div')).toHaveCount(1)
    //we need to get the first output block and check if its a group
    const fileOutputBlockLocator = addExtensions(outputBase, ["0"])
    const fileOutputBlock = outputs.getByTestId(fileOutputBlockLocator)
    //check there are 0 group children
    const fileOutputChildren = fileOutputBlock.getByTestId(outputGroupChildrenLocator)
    await expect(fileOutputChildren.locator('> div')).toHaveCount(1)
    //now we want to get the child and check the title
    const fileChild = fileOutputChildren.getByTestId(fileOutputBlockLocator + "::child")
    await expect(fileChild).toContainText("Dummy File")
})