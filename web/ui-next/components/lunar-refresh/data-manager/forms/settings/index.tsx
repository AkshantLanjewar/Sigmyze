import { Modal } from "@mantine/core"
import { useCallback, useEffect, useRef, useState } from "react"
import SettingsFragment from "./fragments/settings"

interface ISettingsFlowProps {
    /**
     * this is the toggle that activates the settings flow
     */
    settingsFlowToggle: boolean
}

const SettingsFlow: React.FC<ISettingsFlowProps> = ({ settingsFlowToggle }) => {
    //this is whether or not the internal modal is open
    const [open, setOpen] = useState<boolean>(false)

    //this is the current fragment for the modal
    const [fragmentId, setFragmentId] = useState<string | undefined>(undefined)

    //this is the current title for the modal
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined)

    //this is the current fragment for the modal
    const fragment = useRef<React.ReactElement | null>(null)

    //this is the ref to track initial toggle mount
    const initialSettingsFlow = useRef<boolean>(true)
    const initialFlowJank = useRef<boolean>(true)

    //this is the function that resets all the state when the modal closes
    const reset = useCallback(() => {
        setOpen(false)
        setFragmentId(undefined)
        setModalTitle(undefined)
        fragment.current = null
    }, [])

    //this is the function that initalizes the flow
    const initFlow = useCallback(() => {
        setFragmentId("settings")
        setOpen(true)
    }, [])

    //this is the effect that activates the flow based on the toggle
    useEffect(() => {
        if(initialSettingsFlow.current === true) {
            initialSettingsFlow.current = false
            return
        } else if (initialFlowJank.current === true) {
            initialFlowJank.current = false
            return
        }

        
        initFlow()
    }, [settingsFlowToggle])

    //this is the effect that handles the updating of the modal state based on the fragment id
    useEffect(() => {
        if(fragmentId === undefined)
            return

        //reset the modal title and fragment
        setModalTitle(undefined)
        fragment.current = null
        switch(fragmentId) {
            case "settings":
                //first we want to set the modal title to Chart Settings
                setModalTitle("Chart Settings")
                //then we want to set the fragment to the correct component
                fragment.current = <SettingsFragment />

                break
            default:
                return
        }
    }, [fragmentId])

    return (
        <Modal
            opened={open}
            onClose={() => reset()}
            title={modalTitle}
            overlayBlur={4}
            transitionDuration={200}
            exitTransitionDuration={200}
            transition={"pop"}
            centered
            size={"lg"}
        >
            {fragment.current}
        </Modal>
    )
}

export default SettingsFlow