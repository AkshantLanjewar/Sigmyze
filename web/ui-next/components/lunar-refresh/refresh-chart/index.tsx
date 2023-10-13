import { useCallback, useContext, useEffect } from "react"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"
import useRefreshChartState from "./hooks/refresh-chart-data"
import RefreshEngine from "./engine"
import { useElementSize } from "@mantine/hooks"

interface IRefreshChartProps {
    /**
     * This is the fileId of the chart. 
     * Used to retreive data from the data context.
     */
    fileId: string
}

const RefreshChart: React.FC<IRefreshChartProps> = ({ fileId }) => {
    const { editorDebugMode, getFileById } = useContext(LunarUIContextData) as ILunarUIState

    //custom hooks are initiated here
    const { 
        chartTitle, 
        containerRef,
        height,
        width,
        editChartTitle 
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
     * This is the effect that handles the loading of the chart data
     */
    useEffect(() => {
        loadChart()
    }, [loadChart])

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
            <RefreshEngine 
                height={height}
                width={width}
            />
        </div>
    )
}

export default RefreshChart