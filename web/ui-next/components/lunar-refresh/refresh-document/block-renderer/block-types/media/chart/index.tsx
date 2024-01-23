import { useEffect } from "react"
import { Blocks, INoteBlock } from "../../../../types"
import useNoteChart from "../../hooks/chart"
import NoteChartModal from "./modal"
import ChartBody from "./body"

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
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void
}

const NoteChart: React.FC<INoteChartProps> = ({
    block,
    hasRequest,
    updateNoteBlock,
    consumeFocusRequest,
    changeNoteBlock,
    createRawBlock,
    deleteNoteBlock
}) => {
    const { 
        chart,
        render,
        cancelChartSelect,
        updateChart 
    } = useNoteChart(block, changeNoteBlock)

    return (
        <>
            <NoteChartModal
                blockId={block.blockId}
                open={chart === undefined}
                cancel={cancelChartSelect}
                updateNoteBlock={updateNoteBlock}
                updateChart={updateChart}
                createRawBlock={createRawBlock}
            />

            {render && (
                <ChartBody 
                    blockId={block.blockId}
                    chart={chart!}
                    hasRequest={hasRequest}
                    consumeFocusRequest={consumeFocusRequest}
                    deleteNoteBlock={deleteNoteBlock}
                    updateNoteBlock={updateNoteBlock}
                    updateChart={updateChart}
                />
            )}
        </>
    )
}

export { NoteChart }
