import { useCallback, useEffect, useState } from "react"
import { ISerializedNoteChart } from "../media/types"
import { Blocks, INoteBlock } from "../../../types"

/**
 * @description
 *  - this is the hook that encapsulates all the state and logic required for the Chart block to work
 */
const useNoteChart = (
    /**
     * This is the block that is being rendered
     */
    block: INoteBlock,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,
) => {
    /**
     * This is the selected chart data, that has to be serialized / deserialized from the block Content
     * NOTE: The modal will fire when this is undefined
     */
    const [chart, setChart] = useState<ISerializedNoteChart | undefined>({} as ISerializedNoteChart)

    //whether or not to render
    const [render, setRender] = useState<boolean>(false)

    /**
     * @description
     *  - this is the function that cancel's selecting a chart
     *  - it sets the chart to a dummy val and then changes the block type back to a paragraph
     */
    const cancelChartSelect = useCallback(() => {
        setChart({ 
            fileId: "", 
            title: "", 
            hideYAxis: false, 
            hideXAxis: false, 
            hideLegend: false, 
            invertYAxis: false,
            indicators: [],
            showTitle: false 
        })

        changeNoteBlock(block.blockId, "paragraph", "")
    }, [block])

    /**
     * @description
     *  - this is the method to update the chart with a valid object
     */
    const updateChart = useCallback((newChart: ISerializedNoteChart) => {
        if(newChart.marshalCheck !== "swag")
            return

        setChart({ ...newChart })
        setRender(true)
    }, [])

    //this is the effect that handle's the loading of the block data (all state should be updated through parent funcs)
    useEffect(() => {
        try {
            const content = block.blockContent
            const marshal: ISerializedNoteChart = JSON.parse(content)
            if(marshal.marshalCheck !== "swag")
                return

            setChart({ ...marshal })
            setRender(true)
        } catch (error) {
            setRender(false)
            setChart(undefined)
        }
    }, [block])

    return {
        chart,
        render,
        cancelChartSelect,
        updateChart
    }
}

export default useNoteChart