import { useCallback, useContext, useMemo } from "react"
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"
import { IconAlertTriangle } from "@tabler/icons"
import FormBuilder from "../../../ui/form-builder/form-builder"
import { LunarUIContextData } from ".."
import { ILunarUIState } from "../state"

interface IDeleteFolderFormProps {
    /**
     * this function closes the modal, aka setting the modalId state to null
     */
    close: () => void,

    /**
     * @description
     *  - 
     * @param folderId 
     */
    deleteFolder: (folderId: string) => void
}

const DeleteFolderForm: React.FC<IDeleteFolderFormProps> = ({ close, deleteFolder }) => {
    const { activeItemId } = useContext(LunarUIContextData) as ILunarUIState
    
    const formFields: IQuantaFormField[] = useMemo(() => ([
        {   
            type: "alert",
            id: 'alert-component',
            testId: 'delete-warning',
            alertTitle: "Warning",
            alertIcon: <IconAlertTriangle />,
            alertColor: 'red',
            alertContent: "Warning, this is a permanent action. Deleting the folder will also delete all its associated data, permenantly."
        } as IQuantaFormField,
        {
            type: "checkbox",
            id: "delete-confirmation",
            testId: "confirm-checkbox",
            name: "I Understand, and wish to proceed."
        } as IQuantaFormField


    ]), [])

    //FIXME: Fix the deletion logic in dev mode
    const submit = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let valKeys = Object.keys(valStore)
        if(valKeys.includes("delete-confirmation") === false || activeItemId === undefined)
            return

        let deleteConfirmationValue = valStore['delete-confirmation']
        if(deleteConfirmationValue !== "true")
            return

        deleteFolder(activeItemId)
        close()
    }, [activeItemId, deleteFolder])  

    return (
        <FormBuilder
            forms={formFields}
            submit={submit}
            closeModal={close}
            submitStoreDependency={"delete-confirmation"}
        />
    )
}

export default DeleteFolderForm