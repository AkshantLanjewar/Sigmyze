import { Alert, Button, Checkbox, Group, Modal } from "@mantine/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { LunarDataManagerData } from "../.."
import { ILunarDataManagerState } from "../../state"
import { QuantaDatasetManagerData } from "../../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../../ui/quanta-dataset-manager/types"
import { IconAlertCircle } from "@tabler/icons"
import { LunarUIContextData } from "../../../ui-context"
import { ILunarUIState } from "../../../ui-context/state"

interface IDeleteIndicatorFlowProps {
    /**
     * This is the delete indicator flow toggle to be passed to the data manager
     */
    deleteIndicatorFlowToggle: boolean
}

const DeleteIndicatorFlow: React.FC<IDeleteIndicatorFlowProps> = ({ deleteIndicatorFlowToggle }) => {
    //this is whether or not the internal modal is open
    const [open, setOpen] = useState<boolean>(false)

    //this is the short text for the indicator that is active
    const [short, setShort] = useState<string | undefined>(undefined)

    //whether or not the confirm checkbox is checked
    const [checked, setChecked] = useState<boolean>(false)

    const { eventIndicator } = useContext(LunarDataManagerData) as ILunarDataManagerState
    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    const { deleteIndicator } = useContext(LunarUIContextData) as ILunarUIState

    //this is the function that closes the modal
    const close = useCallback(() => {
        setOpen(false)
    }, [])

    //this is the function that handles the deletion of the indicator
    const submit = () => {
        if(eventIndicator === undefined)
            return

        deleteIndicator(eventIndicator)
        setOpen(false)
    }

    useEffect(() => {
        if(eventIndicator === undefined)
            return

        setOpen(true)
    }, [deleteIndicatorFlowToggle])

    useEffect(() => {
        async function main() {
            setShort(undefined)
            if(eventIndicator === undefined)
                return

            let indicatorText = await fetchIndicatorText(eventIndicator.datasetId, eventIndicator.datasetId)
            if(indicatorText === undefined)
                return

            setShort(indicatorText.short)
        }

        main()
    }, [eventIndicator])

    return (
        <Modal
            opened={open}
            onClose={() => close()}
            title={"Delete Indicator"}
            overlayBlur={4}
            transitionDuration={200}
            exitTransitionDuration={200}
            transition={"pop"}
            centered
            size={"md"}
        >
            <div data-testId={"chart-settings-modal"}>
                <Alert
                    icon={<IconAlertCircle size={"1rem"} />}
                    color="orange"
                    title={"Warning: Deleting this Indicator is Permanent"}
                    mb={32}
                    data-testId={"indicator-warning"}
                >
                    Are you sure you want to delete <b>{short}</b>?
                    All data associated with this indicator will be removed from this chart, and any other linked resources
                </Alert>

                <Group 
                    position="center" 
                    data-testId={"indicator-checkbox"}
                    mb={22}
                >
                    <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.currentTarget.checked)}
                        label={"I Understand, please proceed with the Deletion"}
                    />
                </Group>

                <Group position={"center"} spacing={"md"}>
                    <Button
                        color="indigo"
                        radius={"sm"}
                        size="md"
                        data-testId={"indicator-cancel"}
                        onClick={() => close()}
                    >
                        Cancel
                    </Button>

                    <Button
                        color={"red"}
                        radius={"sm"}
                        size="md"
                        disabled={!checked}
                        data-testId={"indicator-delete"}
                        onClick={() => submit()}
                    >
                        Delete
                    </Button>
                </Group>
            </div>
        </Modal>
    )
}

export default DeleteIndicatorFlow