import { Modal } from "@mantine/core"
import { useCallback, useEffect, useRef, useState } from "react"
import { SelectDatasetFragment, SelectIndicatorFragment } from "./fragments"
import ButtonRenderer, { IRenderedButton } from "./button-renderer"

interface IAddIndicatorFlowProps {
    /**
     * This is a toggle to open up and start the add indicator flow
     */
    activateFlow: boolean,
}

/**
 * This is the component that encapsulates the entire add-indicator flow 
 */
const AddIndicatorFlow: React.FC<IAddIndicatorFlowProps> = ({ activateFlow }) => {
    //this is the open / close state of the modal
    const [open, setOpen] = useState<boolean>(false)
    const closeModal = useCallback(() => setOpen(false), [])

    //this is the previous activate flow to keep track
    const [previousActivateFlow, setPreviousActivateFlow] = useState<boolean>(false)

    //this is the current title of the modal
    const [title, setTitle] = useState<string | undefined>(undefined)

    //whether or not the component has been primed
    const primed = useRef<boolean>(false)

    /**
     * THIS is the state of the modal which is keyed by index
     * index 0 = dataset selection phase
     * index 1 = indicator selection phase
     */
    const [formIndex, setFormIndex] = useState(0)
    
    //this is the current fragment of the form that is being rendered
    const [formFragment, setFormFragment] = useState<React.ReactElement | undefined>(undefined)

    //this is the current form state in text used for test validation
    const [formStage, setFormStage] = useState<string | undefined>(undefined)

    //this is the state that handles the rendering buttons
    const [formButtons, setFormButtons] = useState<IRenderedButton[]>([])

    //this is the dataset id that was collected in the inital part of the flow
    const [datasetId, setDatasetId] = useState<string | undefined>(undefined)

    //this is the indicator id that we collect
    const [indicatorId, setIndicatorId] = useState<string | undefined>(undefined)

    //this is the method to open the modal into a fresh add indicator state
    const openAddFlow = useCallback(() => {
        setOpen(true)
        setFormIndex(0)
    }, [])

    const resetFlow = useCallback((delay?: boolean) => {
        setOpen(false)
        setFormIndex(-1)
        setFormStage(undefined)
        setDatasetId(undefined)
        setIndicatorId(undefined)

        if(delay === true)
            setTimeout(() => setFormFragment(undefined), 200)
        else
            setFormFragment(undefined)
    }, [])

    //this is the function that the dataset fragment calls to continue the UX flow
    const datasetContinue = useCallback(() => setFormIndex(1), [])

    //this is the function that resets the flow back to dataset select
    const datasetPrevious = useCallback(() => setFormIndex(0), [])

    //this is the effect that primes the component to be ready
    useEffect(() => {
        resetFlow()
        primed.current = true
    }, [])

    useEffect(() => {
        if(previousActivateFlow === activateFlow)
            return
        if(primed.current === false)
            return

        setPreviousActivateFlow(activateFlow)
        openAddFlow()
    }, [activateFlow])

    //this is the effect that updates any modal state based on what state the form is in
    useEffect(() => {
        setFormButtons([])
        setTitle(undefined)
        setFormStage(undefined)
        setFormFragment(undefined)

        switch(formIndex) {
            case 0:
                setTitle("Select Dataset")
                setFormStage("dataset")
                setFormFragment((
                    <SelectDatasetFragment 
                        previousId={datasetId}
                        setFormButtons={setFormButtons} 
                        resetFlow={resetFlow}
                        setDatasetId={setDatasetId}
                        datasetContinue={datasetContinue}
                    />
                ))

                break
            case 1:
                if(datasetId === undefined)
                    return

                setTitle("Select Indicator")
                setFormStage("indicator")
                setFormFragment((
                    <SelectIndicatorFragment 
                        datasetId={datasetId}
                        setFormButtons={setFormButtons}
                        datasetPrevious={datasetPrevious}
                        setIndicatorId={setIndicatorId}
                    />
                ))

                break
            default:
                return
        }
    }, [formIndex])

    //this is the effect that handles the undisabling of the continue button during the dataset stage
    useEffect(() => {
        if(formIndex !== 0 || datasetId === undefined || formButtons.length < 2)
            return

        let newButtons = formButtons
        newButtons[1].disabled = false
        setFormButtons([ ...newButtons ])
    }, [formButtons, formIndex, datasetId])

    useEffect(() => {
        if(formIndex !== 1 || indicatorId === undefined || formButtons.length < 2)
            return

        let newButtons = formButtons
        newButtons[1].disabled = false
        setFormButtons([ ...newButtons ])
    }, [formButtons, formIndex, indicatorId])

    return (
        <Modal
            opened={open}
            onClose={() => resetFlow(true)}
            title={title}
            transition={"rotate-left"}
            transitionDuration={200}
            exitTransitionDuration={200}
            size={"60%"}
            overlayBlur={4}
            centered
            styles={{
                modal: { 
                    backgroundColor: "rgb(16, 17, 19)",
                    border: "2px solid #25262B" 
                }
            }}
        >
            <div data-testId={"add-indicator-flow-container"} data-stage={formStage}>
                {formFragment}

                <ButtonRenderer buttons={formButtons} />
            </div>
        </Modal>
    )
}

export default AddIndicatorFlow