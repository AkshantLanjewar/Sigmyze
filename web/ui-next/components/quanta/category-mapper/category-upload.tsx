import { useContext, useEffect, useState } from "react"
import FormBuilder from "../../ui/form-builder/form-builder"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { IUIDropdownItem } from "../../ui/ui-dropdown/types"
import { IconDatabase } from "@tabler/icons"
import { showNotification } from "@mantine/notifications"
import { IQuantaFormField } from "../quanta-editor/types/form"

interface ICategoryUploadProps {
    closeModal: () => void
}

const formComponents = [
    {
        type: "file",
        fileType: "json",
        name: "Category Definition",
        id: "source",
        testId: "file-upload"
    },
    {
        type: "dropdown",
        id: "map",
        name: "Map to Field",
        manualDropdownItems: [],
        testId: "dropdown"
    }
] as IQuantaFormField[]

const CategoryUpload: React.FC<ICategoryUploadProps> = ({ closeModal }) => {
    const [loadingStr, setLoadingStr] = useState<string | undefined>(undefined)
    const [internalComponents, setInternalComponents] = useState<IQuantaFormField[]>(formComponents)

    const { updateSchema, getSchema, setCategorization } = useContext(QuantaContextData) as IQuantaState

    const errorMessage = (msg: string) => {
        showNotification({
            color: "red",
            autoClose: 1000 * 5,
            title: "Categorization Error",
            message: msg
        })
    }

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let datasetSchema = getSchema('dataset')?.children
        if(datasetSchema === undefined)
            return

        let fileValue = valStore['source']
        let mappedFieldId = valStore['map']
        
        //error handling
        if(typeof mappedFieldId !== 'string') {
            errorMessage("Malformed Input, please try again")
            return
        } if(typeof fileValue !== 'string') {
            errorMessage("Please upload a categories definition file")
            return
        }

        //find the mapped object
        let mappedObject = undefined
        for(let i = 0; i < datasetSchema.length; i++) {
            let child = datasetSchema[i]
            if(child.nodeId === mappedFieldId)
                mappedObject = child
        }

        if(mappedObject === undefined || mappedObject.name === undefined) {
            errorMessage("Invalid Mapped Object")
            return
        }

        //read the json
        let fileString = Buffer.from(fileValue, 'base64').toString()
        let categoriesObj = JSON.parse(fileString) as { [key: string]: string[] }
        
        //build the categories object
        setCategorization(mappedObject.name, categoriesObj)
        closeModal()
    }

    useEffect(() => {
        let datasetSchema = getSchema('dataset')?.children
        if(datasetSchema === undefined)
            return

        let dropdownItems = [] as IUIDropdownItem[]
        for(let i = 0; i < datasetSchema.length; i++) {
            let child = datasetSchema[i]
            let dropdownItem = {} as IUIDropdownItem
            if(child.nodeId === undefined || child.name === undefined)
                continue

            dropdownItem.id = child.nodeId
            dropdownItem.name = child.name
            dropdownItem.description = "The field in the dataset where the category applies to"
            dropdownItem.icon = <IconDatabase size={18} />
            dropdownItems.push(dropdownItem)
        }

        let nFormComponents = internalComponents
        nFormComponents[1].manualDropdownItems = dropdownItems
        setInternalComponents([ ...nFormComponents ])
    }, [updateSchema])

    return (
        <>
            <FormBuilder
                forms={formComponents}
                submit={submit}
                closeModal={closeModal}
                loadingStr={loadingStr}
            />
        </>
    )
}

export default CategoryUpload