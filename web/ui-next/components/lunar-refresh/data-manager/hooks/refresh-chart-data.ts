import { MutableRefObject, useCallback, useEffect, useState } from "react"
import { ILunarChart, ILunarProject, IQuantaIndicatorLoc } from "../state"
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
 * @function deleteChartIndicator
 *  - this is the functoin that deletes an indicator from a specified chart
 */
const useRefreshChartData = (
    lunarProject: ILunarProject | undefined,
    loadedFilesystem: ISigmyzeFilesystem | undefined,
    skipFilesystem: MutableRefObject<boolean>,
    updateUIFilesystem: (filesystem: ISigmyzeFilesystem) => void,
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>,
    setLunarProject: (project: ILunarProject | undefined) => void
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
    const createNewChart = (chartName: string, chartId: string) => {
        if(lunarProject === undefined)
            return

        let newLunarProject = lunarProject
        const newChart: ILunarChart = {
            name: chartName,
            objectId: chartId,
            indicators: []
        }

        newLunarProject.charts.push(newChart)
        skipFilesystem.current = true
        setLunarProject({ ...newLunarProject })
    }

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the deletion of a chart within the data context
     * @param fileId
     *  - this is the id of the chart we are going to delete
     */
    const deleteChart = useCallback((fileId: string) => {
        if(lunarProject === undefined)
            return

        let newLunarProject = lunarProject
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < lunarProject.charts.length; i++) {
            let chart = lunarProject.charts[i]
            if(chart.objectId === fileId)
                continue
            
            newCharts.push(chart)
        }

        newLunarProject.charts = newCharts
        skipFilesystem.current = true
        setLunarProject({ ...newLunarProject })
    }, [lunarProject])

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
        if(lunarProject === undefined)
            return

        let newLunarProject = lunarProject
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < lunarProject.charts.length; i++) {
            let chart = lunarProject.charts[i]
            if(chart.objectId === fileId)
                chart.name = name

            newCharts.push(chart)
        }

        newLunarProject.charts = newCharts
        skipFilesystem.current = true
        setLunarProject({ ...newLunarProject })
    }, [lunarProject])

    /**
     * This is the function that adds an indicator to the chart data
     */
    const addChartIndicator = (fileId: string, indicator: IQuantaIndicatorLoc) => {
        if(lunarProject === undefined)
            return

        let newLunarProject = lunarProject
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < lunarProject.charts.length; i++) {
            let chart = lunarProject.charts[i]
            if(chart.objectId === fileId)
                chart.indicators.push(indicator)

            newCharts.push(chart)
        }

        newLunarProject.charts = newCharts
        skipFilesystem.current = true
        setLunarProject({ ...newLunarProject })
    }

    /**
     * This is the function that deletes an indicator from the chart data
     */
    const deleteChartIndicator = (fileId: string, indicator: IQuantaIndicatorLoc) => {
        if(lunarProject === undefined)
            return

        let newLunarProject = lunarProject
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < lunarProject.charts.length; i++) {
            let chart = lunarProject.charts[i]
            if(chart.objectId !== fileId) {
                newCharts.push(chart)
                continue
            }

            //now we want to remove the specified indicator from this chart
            let newChartIndicators: IQuantaIndicatorLoc[] = []
            for(let x = 0; x < chart.indicators.length; x++) {
                let _indicator = chart.indicators[x]
                if(_indicator.datasetId === indicator.datasetId && _indicator.indicatorId === indicator.indicatorId)
                    continue

                newChartIndicators.push(_indicator)
            }

            chart.indicators = newChartIndicators
            newCharts.push(chart)
        }

        newLunarProject.charts = newCharts
        skipFilesystem.current = true
        setLunarProject({ ...newLunarProject })
    }

    /**
     * @description
     *  - This is the function that gets the indicators from the loaded chart projects
     * 
     * @param fileId
     *  - this is the fileId for the chart we want
     */
    const getChartIndicators = useCallback((fileId: string) => {
        let indicators: IQuantaIndicatorLoc[] = []
        for(let i = 0; i < charts.length; i++) {
            let _chart = charts[i]
            if(_chart.objectId === fileId)
                indicators = _chart.indicators
        }

        return indicators
    }, [charts])

    /**
     * This is the function that handles the updating of the sigmyze filesystem 
     * when a chart has an indicator appended
     */
    const updateSigmyzeIndicators = (fileId: string) => {
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
    }

    return {
        charts,
        setCharts,
        createNewChart,
        deleteChart,
        editChartName,
        addChartIndicator,
        updateSigmyzeIndicators,
        getChartIndicators,
        deleteChartIndicator
    }
}

export default useRefreshChartData