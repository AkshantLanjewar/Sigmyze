import { Modal } from "@mantine/core"
import { useCallback, useState } from "react"
import ChartSelectStage from "./chart-select"
import { IChartLoc, ISerializedNoteChart } from "../../types"
import { IQuantaIndicatorLoc } from "../../../../../../data-manager/state"
import ChartSettings from "./chart-settings"
import { Blocks } from "../../../../../types"

interface INoteChartModalProps {
    /**
     * Id for the block, used to change the note block
     */
    blockId: string,

    /**
     * This is whether or not the modal is opened. Managed by the selected chart state
     */
    open: boolean,

    /**
     * This is the function that cancels the selection flow
     */
    cancel: () => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * function to update the active chart
     */
    updateChart: (newChart: ISerializedNoteChart) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void
}

const NoteChartModal: React.FC<INoteChartModalProps> = ({ blockId, open, cancel, updateNoteBlock, updateChart, createRawBlock }) => {
    //this is the current step that the modal is on
    const [step, setStep] = useState<'select' | 'settings'>('select')
    //this is the toggle to expand the width of the modal
    const [widthToggle, setWidthToggle] = useState(false)
    //this is the selected chart location
    const [selectedChart, setSelectedChart] = useState<IChartLoc | undefined>(undefined)
    //these are the indicators that have been selected
    const [selectedIndicators, setSelectedIndicators] = useState<IQuantaIndicatorLoc[] | undefined>(undefined)

    //this is the function to set the step to settings
    const continueStep = useCallback((indicators: IQuantaIndicatorLoc[] | undefined) => {
        if(indicators === undefined)
            return

        setWidthToggle(false)
        setSelectedIndicators([ ...indicators ])
        setStep('settings')
    }, [])

    //this is the function to set the step back to select
    const previousStep = useCallback(() => {
        setWidthToggle(true)
        setStep('select')
    }, [])
    
    return (
        <Modal
            opened={open}
            onClose={() => cancel()}
            title={"Select Chart"}
            overlayBlur={4}
            transitionDuration={200}
            exitTransitionDuration={200}
            transition={"pop"}
            centered
            size={widthToggle ? "70%" : "50%"}
        >
            <div data-testId={'select-chart-flow'} data-testValue={step}>
                {step === "select" && (
                    <ChartSelectStage 
                        selected={selectedChart}
                        widthToggle={widthToggle}
                        setSelected={setSelectedChart}
                        setWidthToggle={setWidthToggle}
                        cancel={cancel}
                        continueStep={continueStep}
                    />
                )}

                {step === "settings" && (
                    <ChartSettings
                        blockId={blockId}
                        selected={selectedChart}
                        selectedIndicators={selectedIndicators}
                        previousStep={previousStep}
                        updateNoteBlock={updateNoteBlock}
                        updateChart={updateChart}
                        createRawBlock={createRawBlock}
                    />
                )}
            </div>
        </Modal>
    )
}

export default NoteChartModal