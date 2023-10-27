import { useCallback, useContext, useEffect } from "react"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"
import useRefreshChartState from "./hooks/refresh-chart-data"
import RefreshEngine from "./engine"
import { useElementSize } from "@mantine/hooks"
import ChartTitle from "./chart-title"

interface IRefreshChartProps {
    /**
     * This is the fileId of the chart. 
     * Used to retreive data from the data context.
     */
    fileId: string
}

const RefreshChart: React.FC<IRefreshChartProps> = ({ fileId }) => {
    const { editorDebugMode, getFileById, editFileTitle } = useContext(LunarUIContextData) as ILunarUIState

    //custom hooks are initiated here
    const { 
        chartTitle, 
        containerRef,
        height,
        width,
        editChartTitle, 
    } = useRefreshChartState()

    /**
     * this is the method that loads the chart data
     */
    const loadChart = useCallback(() => {
        //first we want to get the title for the chart
        let file = getFileById(fileId)
        if(file === undefined)
            return

        let fileName = file.fileName
        editChartTitle(fileName)
    }, [fileId, editorDebugMode, getFileById])

    /**
     * NOTE: This method is to only be used by the chart-title component
     * this is a wrapper for the editFileTitle, so we can edit this file's title
     */

    /**
     * This is the effect that handles the loading of the chart data
     */
    useEffect(() => {
        loadChart()
    }, [loadChart])

    //TODO: Now we have to implement the title, and its editing functionality

    return (
        <div 
            data-testId={"refresh-chart"}
            ref={containerRef}
            style={{ 
                height: "100%", 
                width: "100%",
                background: "#101113",
                display: "block",
                position: 'relative' 
            }}
        >
            <ChartTitle
                chartTitle={chartTitle}
                editChartTitle={editChartTitle}
            />

            <RefreshEngine 
                height={height}
                width={width}
            />
        </div>
    )
}

export default RefreshChart