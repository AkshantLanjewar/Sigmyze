import { useCallback, useState } from "react"
import { ILunarChart, IQuantaIndicatorLoc } from "../state"
import { ISigmyzeFilesystem } from "../../../ui/file-management/types"
import { IQuantaIndicatorText } from "../../../ui/quanta-dataset-manager/types"
import { setChartIndicators } from "../../../ui/file-management/util"

/**
 * @description
 *  - this is the hook that abstracts all the logic related to charts 
 * 
 * @function setCharts
 *  - NOTE: should not be used by external functions
 *  - this is the function that sets the RAW chart data.
 * @function createNewChart
 *  - NOTE: this function should not be used by external functions
 *  - this is the function that handles the creation of a new chart
 * @function deleteChart
 *  - NOTE: this function should not be used by external functions
 *  - this is the function that handles the deletion of an existing chart
 * @function editChartName
 *  - NOTE: this function should not be used by external functions
 *  - this is the function that changes a chart's name
 * @function addChartIndicator
 *  - this is the function that adds an indicator to the chart
 */
const useRefreshChartData = (
    loadedFilesystem: ISigmyzeFilesystem | undefined,
    updateUIFilesystem: (filesystem: ISigmyzeFilesystem) => void,
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>
) => {
    //this is the charts in the project (detached for easier editing)
    const [charts, setCharts] = useState<ILunarChart[]>([])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the creation of a new chart within the data context.
     * @param chartName
     *  - this is the name for the new chart
     * @param chartId
     *  - this is the id for the new chart
     */
    const createNewChart = useCallback((chartName: string, chartId: string) => {
        const newChart: ILunarChart = {
            name: chartName,
            objectId: chartId,
            indicators: []
        }

        setCharts([ ...charts, newChart ])
    }, [charts])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the deletion of a chart within the data context
     * @param fileId
     *  - this is the id of the chart we are going to delete
     */
    const deleteChart = useCallback((fileId: string) => {
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < charts.length; i++) {
            let chart = charts[i]
            if(chart.objectId === fileId)
                continue
            
            newCharts.push(chart)
        }

        setCharts([ ...newCharts ])
    }, [charts])

    /**
     * NOTE: This function should only be used within the data context.
     * 
     * @description
     *  - this is the function that edits a charts name based on its fileId
     * @param fileId
     *  - this is the fileId of the chart we want to edit
     * @param name
     *  - this is the title for the new chart
     */
    const editChartName = useCallback((fileId: string, name: string) => {
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < charts.length; i++) {
            let chart = charts[i]
            if(chart.objectId === fileId)
                chart.name = name

            newCharts.push(chart)
        }

        setCharts([ ...newCharts ])
    }, [charts])

    /**
     * This is the function that adds an indicator to the chart data
     */
    const addChartIndicator = (fileId: string, indicator: IQuantaIndicatorLoc) => {
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < charts.length; i++) {
            let chart = charts[i]
            if(chart.objectId === fileId)
                chart.indicators.push(indicator)

            newCharts.push(chart)
        }

        setCharts([ ...newCharts ])
    }

    /**
     * This is the function that handles the updating of the sigmyze filesystem 
     * when a chart has an indicator appended
     */
    const updateSigmyzeIndicators = useCallback((fileId: string) => {
        async function main() {
            if(loadedFilesystem === undefined)
                return

            //we need to find the chart to get the list of indicators we need
            let chart: ILunarChart | undefined = undefined
            for(let i = 0; i < charts.length; i++) {
                let _chart = charts[i]
                if(_chart.objectId === fileId)
                    chart = _chart
            }

            if(chart === undefined)
                return

            let indicators = chart.indicators
            let newFilesystem = await setChartIndicators(loadedFilesystem, fileId, indicators, fetchIndicatorText)
            updateUIFilesystem(newFilesystem)
        }

        main()
    }, [charts, loadedFilesystem])

    return {
        charts,
        setCharts,
        createNewChart,
        deleteChart,
        editChartName,
        addChartIndicator,
        updateSigmyzeIndicators
    }
}

export default useRefreshChartData