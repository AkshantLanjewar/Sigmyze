import { IconAlertCircle } from "@tabler/icons"
import { Alert, Button, Checkbox, Group } from "@mantine/core"
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useContext, useState } from "react"
import { IQuantaIndicatorLoc } from "../../../../state"
import { LunarUIContextData } from "../../../../../ui-context"
import { ILunarUIState } from "../../../../../ui-context/state"

interface IDeleteIndicatorFragmentProps {
    /**
     * This is the ref that tracks the active indicator during an event state change
     */
    eventIndicator: MutableRefObject<IQuantaIndicatorLoc | null>,

    /**
     * This is the function that sets the settings modal's current fragment
     */
    setFragmentId: Dispatch<SetStateAction<string | undefined>>
}

const DeleteIndicatorFragment: React.FC<IDeleteIndicatorFragmentProps> = ({ eventIndicator, setFragmentId }) => {    
    const { deleteIndicator } = useContext(LunarUIContextData) as ILunarUIState
    
    //whether or not the confirm checkbox is checked
    const [checked, setChecked] = useState<boolean>(false)

    const deleteIndicatorCB = useCallback(() => {
        if(eventIndicator.current === null)
            return

        deleteIndicator(eventIndicator.current)
        eventIndicator.current = null
        setFragmentId("settings")
    }, [])
    
    return (
        <div data-testId={"chart-settings-modal"}>
            <Alert
                icon={<IconAlertCircle size={"1rem"} />}
                color="orange"
                title={"Warning: Deleting this Indicator is Permanent"}
                mb={32}
                data-testId={"indicator-warning"}
            >
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
                    onClick={(e) => {
                        eventIndicator.current = null
                        setFragmentId("settings")
                    }}
                >
                    Cancel
                </Button>

                <Button
                    color={"red"}
                    radius={"sm"}
                    size="md"
                    disabled={!checked}
                    data-testId={"indicator-delete"}
                    onClick={() => deleteIndicatorCB()}
                >
                    Delete
                </Button>
            </Group>
        </div>
    )
}

export default DeleteIndicatorFragment