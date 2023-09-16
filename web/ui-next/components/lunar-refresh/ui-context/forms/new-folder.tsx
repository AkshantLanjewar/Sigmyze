import { useCallback, useMemo } from "react"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"
import { IconSignature } from "@tabler/icons"
import FormBuilder from "../../../ui/form-builder/form-builder"

interface INewFolderModalProps {
    /**
     * this function closes the modal, aka setting the modalId state to null
     */
    close: () => void,

    /**
     * this is a context function that creates a folder within the sigmyzefilesystem and updates the data context as well
     * @param folderName
     *  - this is the name of the folder we are trying to create
     */
    createFolder: (folderName: string) => void
}

const NewFolderModal: React.FC<INewFolderModalProps> = ({ close, createFolder }) => {
    const formFields: IQuantaFormField[] = useMemo(() => ([
        {
            type: "text",
            name: "New Folder Name",
            icon: <IconSignature />,
            id: "folder-name",
            testId: "folder-name"
        } as IQuantaFormField
    ]), [])

    /**
     * this is the function that is called whenever the form is submitted.
     * The goal is to create a new folder within the activeFolder with the name that was provided in the form.
     * @param forms
     *  - theese the forms that were passed to the form builder component
     * @param valStore
     *  - this is the dynamic object containing the values collected from the form
     */
    const submit = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let storeKeys = Object.keys(valStore)
        if(storeKeys.includes('folder-name') === false)
            return

        let folderName = valStore['folder-name']
        if(typeof folderName !== 'string')
            return

        createFolder(folderName)
        close()
    }, [createFolder])
    
    return (
        <FormBuilder
            forms={formFields}
            submit={submit}
            closeModal={close}
        />
    )
}

export default NewFolderModal