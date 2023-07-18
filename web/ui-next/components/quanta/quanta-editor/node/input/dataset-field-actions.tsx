import { IconSignature } from "@tabler/icons"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { QuantaContextData } from "../../../../data/quanta/context"
import { IQuantaState } from "../../../../data/quanta/types"
import { IQuantaFormField } from "../../types/form"
import { IQuantaSocket } from "../../types/node-instructions"
import DatasetFieldActionsView from "./dataset-field-actions-view"

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

    const deleteField = useCallback(() => {
        let socketId = socket.socketId
        if(socketId === undefined)
            return

        deleteElement("dataset", socketId)
    }, [socket, deleteElement])

    const openEditName = useCallback(() => {
        let socketName = socket.socketName
        if(socketName === undefined)
            return

        let nDefaultValues = { name: socketName }
        setDefaultValues({ ...nDefaultValues })
        setModalState("edit_name")
    }, [socket])

    const formFields = useMemo(() => ([
        {
            type: "text",
            name: "Field Name",
            icon: <IconSignature />,
            id: "name"
        }
    ] as IQuantaFormField[]), [])

    const submit = useCallback((forms: IQuantaFormField[], valStore: {[key: string]: any}) => {
        let newName = valStore["name"]
        let nodeId = socket.socketId
        if(typeof newName !== "string" || nodeId === undefined)
            return

        editSchema("dataset", nodeId, "edit_text", newName, undefined)
        closeModal()
    }, [socket, editSchema])

    return (
        <DatasetFieldActionsView
            modalState={modalState}
            formFields={formFields}
            defaultValues={defaultValues}
            internalFocused={internalFocused}
            deleteField={deleteField}
            openEditName={openEditName}
            closeModal={closeModal}
            submit={submit}
        />
    )
}

export default DatasetFieldActions