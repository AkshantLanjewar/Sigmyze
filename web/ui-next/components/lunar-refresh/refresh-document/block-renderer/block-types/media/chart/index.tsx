import { Blocks, INoteBlock } from "../../../../types"
import useNoteChart from "../../hooks/chart"
import NoteChartModal from "./modal"

interface INoteChartProps {
    /**
     * This is the block that is being rendered
     */
    block: INoteBlock,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void
}

const NoteChart: React.FC<INoteChartProps> = ({
    block,
    hasRequest,
    updateNoteBlock,
    consumeFocusRequest,
    changeNoteBlock
}) => {
    const { 
        chart,
        cancelChartSelect 
    } = useNoteChart(block, changeNoteBlock)

    return (
        <>
            <NoteChartModal
                open={chart === undefined}
                cancel={cancelChartSelect}
            />
        </>
    )
}

export { NoteChart }