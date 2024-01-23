import { useRef, useState, useCallback, useEffect } from "react"
import { ISerializedNoteChart } from "../../types"
import { Modal } from "@mantine/core"
import ChartSettings from "./chart-settings"
import { Blocks } from "../../../../../types"

interface IChartSettingsModalProps {
    /**
     * this is the boolean that toggles the delete modal
     */
    toggle: boolean,

    /**
     * blockId for the block
     */
    blockId: string,

    /**
     * The chart whose settings we are trying to edit
     */
    chart: ISerializedNoteChart,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * function to update the active chart
     */
    updateChart: (newChart: ISerializedNoteChart) => void,
}

const ChartSettingsModal: React.FC<IChartSettingsModalProps> = ({ toggle, blockId, chart, updateNoteBlock, updateChart }) => {
    //initial toggle ref
    const initalRef = useRef<boolean>(true)
    //second toggle ref
    const seconRef = useRef<boolean>(true)

    //whether or not the modal is open
    const [open, setOpen] = useState<boolean>(false)

    //close the modal
    const close = useCallback(() => setOpen(false), [])

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
    
    return (
        <Modal
            opened={open}
            overlayBlur={4}
            transitionDuration={100}
            exitTransitionDuration={100}
            transition={"scale"}
            centered
            onClose={() => close()}
            title={"Chart Settings"}
            size={"50%"}
        >
            <ChartSettings
                payload={chart}
                blockId={blockId}
                selectedIndicators={undefined}
                selected={undefined}
                previousStep={() => true}
                updateNoteBlock={updateNoteBlock}
                updateChart={updateChart}
                createRawBlock={(type: Blocks) => true}
                cancel={close}
            />
        </Modal>
    )
}

export default ChartSettingsModal