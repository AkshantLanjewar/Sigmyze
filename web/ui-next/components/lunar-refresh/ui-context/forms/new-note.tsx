import { useCallback, useMemo } from "react"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"
import { IconSignature } from "@tabler/icons"
import FormBuilder from "../../../ui/form-builder/form-builder"

interface INewNoteFormProps {
    /**
     * this function closes the modal, aka setting the modalId state to null
     */
    close: () => void,

    /**
     * this is a context function that creates a file within the sigmyzefilesystem and updates the data context as well
     * @param fileName
     *  - this is the name of the file we are trying to create
     * @param fileType 
     *  - this is the type of file we are trying to create
     */
    createFile: (fileName: string, fileType: string) => void
}

const NewNoteForm: React.FC<INewNoteFormProps> = ({ close, createFile }) => {
    const formFields: IQuantaFormField[] = useMemo(() => ([
        {   
            type: "text",
            name: "New Note Name",
            icon: <IconSignature />,
            id: 'note-name',
            testId: 'note-name'
        } as IQuantaFormField
    ]), [])

    /**
     * this is the function that is called whenever the form is submitted.
     * The goal is to create a new note within the activeFolder with the name that was provided in the form.
     * @param forms
     *  - theese the forms that were passed to the form builder component
     * @param valStore
     *  - this is the dynamic object containing the values collected from the form
     */
    const submit = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let storeKeys = Object.keys(valStore)
        if(storeKeys.includes('note-name') === false)
            return

        let noteName = valStore['note-name']
        if(typeof noteName !== 'string')
            return

        createFile(noteName, "quanta::note")
        close()
    }, [createFile]) 

    return (
        <FormBuilder
            forms={formFields}
            submit={submit}
            closeModal={close}
        />
    )
}

export default NewNoteForm