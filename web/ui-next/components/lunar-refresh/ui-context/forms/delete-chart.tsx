import { LunarUIContextData } from ".."
import { IQuantaFormField } from "../../../quanta/quanta-editor/types/form"
import { ILunarUIState } from "../state"
import React, { useCallback } from "react"
import { IconAlertTriangle } from "@tabler/icons"
import { useContext, useMemo } from "react"
import FormBuilder from "../../../ui/form-builder/form-builder"

interface IDeleteChartProps {
    /**
     * this function closes the modal, aka setting the modalId state to null
     */
    close: () => void,

    /*
     * This is the function that handles file deletion within the editor 
     */
    deleteFile: (fileId: string) => void

    /*
     * Whether or not this is for the note 
     */
    isNote: boolean
}

const DeleteChart: React.FC<IDeleteChartProps> = ({ close, deleteFile, isNote }) => {
    const { activeItemId } = useContext(LunarUIContextData) as ILunarUIState

    const formFields: IQuantaFormField[] = useMemo(() => ([
        {   
            type: "alert",
            id: 'alert-component',
            testId: 'delete-warning',
            alertTitle: "Warning",
            alertIcon: <IconAlertTriangle />,
            alertColor: 'red',
            alertContent: `Warning, this is a permanent action. Deleting the ${isNote ? 'note' : 'chart'} will also delete all its associated data, permenantly.`
        } as IQuantaFormField,
        {
            type: "checkbox",
            id: "confirm-delete",
            testId: "confirm-checkbox",
            name: "I Understand, and wish to proceed."
        } as IQuantaFormField
    ]), [])

    const submit = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        if(activeItemId === undefined)
            return

        let valKeys = Object.keys(valStore)
        if(valKeys.includes("confirm-delete") === false || activeItemId === undefined)
            return

        let deleteConfirmationValue = valStore['confirm-delete']
        if(deleteConfirmationValue !== "true")
            return

        deleteFile(activeItemId)
        close()
    }, [activeItemId, deleteFile])

    return (
        <div data-testId={isNote ? "delete-note-modal" : "delete-chart-modal"}>
            <FormBuilder
                forms={formFields}
                submit={submit}
                closeModal={close}
                submitStoreDependency={"confirm-delete"}
                submitText={"Delete"}
            />
        </div>
    )
}

export default DeleteChart
