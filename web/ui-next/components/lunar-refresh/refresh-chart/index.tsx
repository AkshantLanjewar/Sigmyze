import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"
import useRefreshChartState from "./hooks/refresh-chart-data"
import RefreshEngine from "./engine"
import ChartTitle from "./chart-title"
import { ILunarDataManagerState, IQuantaIndicatorLoc } from "../data-manager/state"
import { LunarDataManagerData } from "../data-manager"
import ChartLegend from "./chart-legend"

interface IRefreshChartProps {
    /**
     * This is the fileId of the chart. 
     * Used to retreive data from the data context.
     */
    fileId: string
}

const RefreshChart: React.FC<IRefreshChartProps> = ({ fileId }) => {
    //these are the indicators that will be rendered within the chart
    const [indicators, setIndicators] = useState<IQuantaIndicatorLoc[]>([])
    //this is the toggle that updates the UI filetree
    const [updateUIToggle, setUpdateUIToggle] = useState<boolean>(false)

    /**
     * this is the method that adds an indicator to the internal indicator list
     */
    const addIndicator = (indicator: IQuantaIndicatorLoc) => {
        let newIndicators = indicators
        newIndicators.push(indicator)

        setIndicators([ ...newIndicators ])
    }

    const { 
        editorDebugMode, 
        activeFile, 
        addQueueLength,
        consumeIndicator,
        getFileById, 
        editFileTitle 
    } = useContext(LunarUIContextData) as ILunarUIState

    const { addChartIndicator, updateSigmyzeIndicators } = useContext(LunarDataManagerData) as ILunarDataManagerState

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
     * This is the effect that updates the UI filesystem with the updated
     * indicators. called by toggle so that components can properly update
     */
    useEffect(() => {
        if(updateUIToggle === false)
            return

        //call the function
        updateSigmyzeIndicators(fileId)
        setUpdateUIToggle(false)
    }, [updateUIToggle, fileId])


    /**
     * This is the effect that handles the consuming of an add indicator request
     * if this is the current active file within the UI
     */
    useEffect(() => {
        if(fileId !== activeFile  || addQueueLength === 0)
            return

        let newIndicator = consumeIndicator()
        if(newIndicator === undefined)
            return

        addIndicator(newIndicator)
        addChartIndicator(fileId, newIndicator)
        setUpdateUIToggle(true)
    }, [fileId, activeFile, addQueueLength])

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
                fileId={fileId}
                chartTitle={chartTitle}
                editChartTitle={editChartTitle}
                editFileTitle={editFileTitle}
            />

            <ChartLegend indicators={indicators} />

            <RefreshEngine 
                height={height}
                width={width}
                indicators={indicators}
            />
        </div>
    )
}

export default RefreshChart