import { useCallback, useEffect, useRef, useState } from "react"
import { IQuantaIndicator } from "../../../../quanta/quanta-indicator-manager/types"
import { IQuantaIndicatorLoc } from "../../../data-manager/state"
import { ScaleLinear, ScaleTime, extent, max, min } from "d3"
import { scaleLinear, scaleTime } from "@visx/scale"

/**
 * This is the internal structure that we will be rendering into d3 scales
 */
interface IRenderedSeries {
    /**
     * this is the date, converted from the UTC timestamp
     */
    date: Date,

    /**
     * This is the numerical value corresponding to the date
     */
    value: number,

    /**
     * This is the id of the indicator this series belongs too
     */
    indicatorId: string
}

/**
 * This is what is converted into a visx shape
 */
interface IQuantaSeries {
    /**
     * This is the ID of the indicator being rendered
     */
    indicatorId: string,

    /**
     * line data to be converted into a visx shape
     */
    data: IRenderedSeries[],
}

/**
 * @description
 *  - this is the function that turns the Loc's into actual rendering state
 */
const useQuantaChartData = (
    indicators: IQuantaIndicatorLoc[],
    xMax: number,
    yMax: number,
    fetchIndicator: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicator | undefined>,
) => {
    //this is whether or not the chart is loading a data op or not
    const [loading, setLoading] = useState<boolean>(false)
    //this is whether or not the chart is ready to be painted
    const [ready, setReady] = useState<boolean>(false)
    //these are the indicators that have been fetched
    const [fetched, setFetched] = useState<IQuantaIndicator[]>([])
    //these are the series that can be rendered by the chart
    const [renderedSeries, setRenderedSeries] = useState<IQuantaSeries[]>([])
    //this is the date scale
    const dateScale = useRef<ScaleTime<number, number, never> | null>(null)
    //this is the linear scale
    const rightScale = useRef<ScaleLinear<number, number, never> | null>(null)

    //this is the accessor to access the x field from the data
    const xAccessor = useCallback((d: IRenderedSeries) => d.date, [])
    //this is the accessor to access the y field from the data
    const yAccessor = useCallback((d: IRenderedSeries) => d.value, [])

    //this is the effect that fetches the indicators whenever it is updated
    useEffect(() => {
        async function main() {
            let newFetched: IQuantaIndicator[] = []
            for(let i = 0; i < indicators.length; i++) {
                let indicator = indicators[i]
                let fetchedIndicator = await fetchIndicator(indicator.datasetId, indicator.indicatorId)
                
                if(fetchedIndicator === undefined)
                    continue
                if(fetchedIndicator.chartData === undefined || fetchedIndicator.field === undefined)
                    continue

                newFetched.push(fetchedIndicator)
            }

            setFetched([ ...newFetched ])
        }

        setLoading(true)
        main()
    }, [indicators])

    //this is the effect that constructs all the necessary structures in order for the chart to render
    useEffect(() => {
        //we need to convert our raw indicators into the data struct that will be rendered
        let series: IRenderedSeries[] = []
        for(let i = 0; i < fetched.length; i++) {
            let fetchedIndicator = fetched[i]
            if(fetchedIndicator.chartData === undefined || fetchedIndicator.indicatorId === undefined)
                continue

            //now we go through all the chartseries and add them as a rendered series entry
            for(let x = 0; x < fetchedIndicator.chartData.length; x++) {
                let point = fetchedIndicator.chartData[x]
                if(point.xValue === undefined || point.yValue === undefined)
                    continue

                let seriesPoint: IRenderedSeries = {
                    date: new Date(point.xValue * 1000),
                    value: point.yValue,
                    indicatorId: fetchedIndicator.indicatorId
                }

                series.push(seriesPoint)
            }
        }

        //now that we have concatenated the data, we can make the xScale
        const xScale = scaleTime<number>({
            range: [0, xMax],
            domain: extent(series, xAccessor) as unknown as [Date, Date]
        })

        //now we can also make the y scale as well
        let minVal = min(series, yAccessor)
        let maxVal = max(series, yAccessor)

        if(minVal === undefined || maxVal === undefined) {
            setLoading(false)
            return
        }

        const yScale = scaleLinear({
            range: [yMax, 0],
            domain: [minVal, maxVal]
        })

        //finally we have to convert the indicators into appropriate series so it can be made into a shape
        let quantaSeries: IQuantaSeries[] = []
        for(let i = 0; i < fetched.length; i++) {
            let fetchedIndicator = fetched[i]
            if(fetchedIndicator.chartData === undefined || fetchedIndicator.indicatorId === undefined)
                continue

            let quantaPoint: IQuantaSeries = {
                indicatorId: fetchedIndicator.indicatorId,
                data: []
            }

            //now go through and make the series data points
            for(let x = 0; x < fetchedIndicator.chartData.length; x++) {
                let chartPoint = fetchedIndicator.chartData[x]
                if(chartPoint.xValue === undefined || chartPoint.yValue === undefined)
                    continue

                let renderedPoint: IRenderedSeries = {
                    indicatorId: fetchedIndicator.indicatorId,
                    date: new Date(chartPoint.xValue * 1000),
                    value: chartPoint.yValue
                }

                quantaPoint.data.push(renderedPoint)
            }

            quantaSeries.push(quantaPoint)
        }


        //now we want to update the state so the chart can render
        dateScale.current = xScale
        rightScale.current = yScale
        setRenderedSeries([ ...quantaSeries ])
        setLoading(false)
    }, [fetched, xMax, yMax])

    return {
        loading,
        ready,
        renderedSeries,
        dateScale: dateScale.current,
        rightScale: rightScale.current
    }
}

export type { IRenderedSeries, IQuantaSeries }
export default useQuantaChartData