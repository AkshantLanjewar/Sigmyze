import { Modal } from "@mantine/core"
import { useState } from "react"
import ChartSelectStage from "./chart-select"
import { IChartLoc } from "../types"

interface INoteChartModalProps {
    /**
     * This is whether or not the modal is opened. Managed by the selected chart state
     */
    open: boolean,

    /**
     * This is the function that cancels the selection flow
     */
    cancel: () => void
}

const NoteChartModal: React.FC<INoteChartModalProps> = ({ open, cancel }) => {
    //this is the current step that the modal is on
    const [step, setStep] = useState<'select' | 'settings'>('select')
    //this is the toggle to expand the width of the modal
    const [widthToggle, setWidthToggle] = useState(false)
    //this is the selected chart location
    const [selectedChart, setSelectedChart] = useState<IChartLoc | undefined>(undefined)
    
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
            size={widthToggle ? "70%" : "45%"}
        >
            {step === "select" && (
                <ChartSelectStage 
                    selected={selectedChart}
                    widthToggle={widthToggle}
                    setSelected={setSelectedChart}
                    setWidthToggle={setWidthToggle}
                />
            )}
        </Modal>
    )
}

export default NoteChartModal