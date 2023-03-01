import { Button, Checkbox, Group, Stack } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { QuantaEditorContext } from "../quanta-editor"

interface IDeleteNodeFormProps {
    opened?: boolean,
    closeModal: () => void
}

const DeleteNodeForm: React.FC<IDeleteNodeFormProps> = ({ opened, closeModal }) => {
    const [checked, setChecked] = useState(false)
    const quantaEditorContext = useContext(QuantaEditorContext)

    useEffect(() => {
        if(opened === undefined)
            return
        if(opened === false)
            setChecked(false)
    }, [opened])

    function deleteHandler() {
        if(quantaEditorContext === null)
            return

        quantaEditorContext.editorDeleteNode()
        closeModal()
    }

    return (
        <div>
            <Stack spacing={10}>
                <form>
                    <Checkbox
                        label={"Delete this Node"}
                        color={"indigo"}
                        checked={checked}
                        onChange={(event) => setChecked(event.currentTarget.checked)}
                    />

                    <Group position={"right"}>
                        <Button
                            variant={'subtle'}
                            color={'indigo'}
                            size={'xs'}
                            px={'xs'}
                            onClick={() => { closeModal() }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant={'subtle'}
                            color={'red'}
                            size={'xs'}
                            px={'xs'}
                            onClick={() => { deleteHandler() }}
                            disabled={!checked}
                        >
                            Delete
                        </Button>
                    </Group>
                </form>
            </Stack>
        </div>
    )
}

export default DeleteNodeForm