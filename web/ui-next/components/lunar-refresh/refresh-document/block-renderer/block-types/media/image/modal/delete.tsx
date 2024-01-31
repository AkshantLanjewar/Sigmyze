import { IconAlertTriangle } from "@tabler/icons"
import { useRef, useState, useCallback, useEffect, useMemo } from "react"
import { IQuantaFormField } from "../../../../../../../quanta/quanta-editor/types/form"
import { Modal } from "@mantine/core"
import FormBuilder from "../../../../../../../ui/form-builder/form-builder"

interface IImageDeleteModalProps {
    /**
     * this is the boolean that toggles the delete modal
     */
    toggle: boolean,

    /**
     * blockId for the block
     */
    blockId: string,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void
}

const ImageDeleteModal: React.FC<IImageDeleteModalProps> = ({ toggle, blockId, deleteNoteBlock }) => {
    //initial toggle ref
    const initalRef = useRef<boolean>(true)
    //second toggle ref
    const seconRef = useRef<boolean>(true)

    //whether or not the modal is open
    const [open, setOpen] = useState<boolean>(false)

    //close the modal
    const close = useCallback(() => setOpen(false), [])

    const formFields: IQuantaFormField[] = useMemo(() => ([
        {
            type: "alert",
            id: "alert-component",
            testId: "delete-warning",
            alertTitle: "Warning",
            alertIcon: <IconAlertTriangle />,
            alertColor: "orange",
            alertContent: "Are you sure you want to remove this image from the document?"
        } as IQuantaFormField,
        {
            type: "checkbox",
            id: "delete-confirmation",
            testId: "confirm-checkbox",
            name: "I Understand, and wish to proceed."
        } as IQuantaFormField
    ]), [])

    //effect that handles the toggle
    useEffect(() => {
        if(initalRef.current === true) {
            initalRef.current = false
            return
        } else if (seconRef.current === true) {
            seconRef.current = false
            return
        }

        setOpen(true)
    }, [toggle])

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let valKeys = Object.keys(valStore)
        if(valKeys.includes("delete-confirmation") === false)
            return

        let deleteConfirmationValue = valStore['delete-confirmation']
        if(deleteConfirmationValue !== "true")
            return

        close()
        deleteNoteBlock(blockId)
    }
    
    return (
        <Modal
            opened={open}
            overlayBlur={4}
            transitionDuration={100}
            exitTransitionDuration={100}
            transition={"scale"}
            centered
            onClose={() => close()}
            title={"Are you sure?"}
            size={"md"}
        >
            <FormBuilder
                forms={formFields}
                submit={submit}
                closeModal={close}
                submitStoreDependency={"delete-confirmation"}
                submitText="Delete"
            />
        </Modal>
    )
}

export default ImageDeleteModal