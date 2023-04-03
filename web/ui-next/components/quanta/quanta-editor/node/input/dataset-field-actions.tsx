import { ActionIcon, Tooltip } from "@mantine/core"
import { IconPencil, IconSignature, IconTrash } from "@tabler/icons"
import { useContext, useEffect, useState } from "react"
import { Motion, spring } from "react-motion"
import { QuantaContextData } from "../../../../data/quanta/context"
import { IQuantaState } from "../../../../data/quanta/types"
import FormBuilder from "../../../../ui/form-builder/form-builder"
import ModalManager from "../../../../ui/modal-manager"
import { IQuantaFormField } from "../../types/form"
import { IQuantaSocket } from "../../types/node-instructions"
import styles from '../node-renderer.module.scss'

interface IDatasetFieldActionsProps {
    socket: IQuantaSocket,
    focused?: boolean
}

const DatasetFieldActions: React.FC<IDatasetFieldActionsProps> = ({ socket, focused }) => {
    const [internalFocused, setInternalFocused] = useState(false)
    const [defaultValues, setDefaultValues] = useState<{[key: string]: any} | undefined>(undefined)
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    const { deleteElement, editSchema } = useContext(QuantaContextData) as IQuantaState

    useEffect(() => {
        if(focused === undefined)
            return

        setInternalFocused(focused)
    }, [focused])

    useEffect(() => {
        if(modalState === null)
            setDefaultValues(undefined)
    }, [modalState])

    function deleteField() {
        let socketId = socket.socketId
        if(socketId === undefined)
            return

        deleteElement("dataset", socketId)
    }

    function openEditName() {
        let socketName = socket.socketName
        if(socketName === undefined)
            return

        let nDefaultValues = { name: socketName }
        setDefaultValues({ ...nDefaultValues })
        setModalState("edit_name")
    }

    const formFields = [
        {
            type: "text",
            name: "Field Name",
            icon: <IconSignature />,
            id: "name"
        }
    ] as IQuantaFormField[]

    const submit = (forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let newName = valStore["name"]
        let nodeId = socket.socketId
        if(typeof newName !== "string" || nodeId === undefined)
            return

        editSchema("dataset", nodeId, "edit_text", newName, undefined)
        closeModal()
    }

    return (
        <>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    id="edit_name"
                    title="Edit Field Name"
                >
                    <FormBuilder
                        forms={formFields}
                        submit={submit}
                        closeModal={closeModal}
                        defaultValue={defaultValues}
                    />
                </ModalManager.Modal>
            </ModalManager>

            <Motion style={{ x: spring(internalFocused ? -95 : 0), opacity: spring(internalFocused ? 1 : 0) }}>
                {({ x, opacity }) => (
                    <div className={styles.node__add} style={{ left: x, opacity: opacity }}>
                        <Tooltip
                            withArrow
                            color={"dark"}
                            label={"Delete Field"}
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                            openDelay={250}
                            transition={"slide-down"}
                            position={"top"}
                        >
                            <ActionIcon
                                color={"red"}
                                variant={"light"}
                                radius={"sm"}
                                onClick={() => deleteField()}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip
                            withArrow
                            color={"dark"}
                            label={"Edit Name"}
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                            openDelay={250}
                            transition={"slide-down"}
                            position={"top"}
                        >
                            <ActionIcon
                                color={"cyan"}
                                variant={"light"}
                                radius={"sm"}
                                onClick={() => openEditName()}
                            >
                                <IconPencil size={18} />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                )}
            </Motion>
        </>
    )
}

export default DatasetFieldActions