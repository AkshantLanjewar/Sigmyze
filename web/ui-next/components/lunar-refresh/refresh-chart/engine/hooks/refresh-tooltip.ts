import { bisector } from "d3-array"
import { RefObject, useCallback, useState } from "react"
import { IQuantaSeries, IRenderedSeries } from "./quanta-data"
import { ISigmyzeMargin } from "../types"
import { ScaleTime } from "d3"
import { localPoint, touchPoint } from "@visx/event"

/**
 * @description
 *  - this is the hook that handles all the tooltip related state for the refresh engine
 */
const useRefreshTooltip = (
    renderedSeries: IQuantaSeries[],
    refreshRef: RefObject<SVGSVGElement>,
    xMax: number,
    yMax: number,
    margin: ISigmyzeMargin,
    xScale: ScaleTime<number, number, never> | null
) => {
    //this is whether or not the tooltip is open
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    //this is the x position of the cursor to track the tooltip line
    const [leftLinePos, setLeftLinePos] = useState<number>(-100)

    //this is the function that closes the tooltip
    const closeTooltip = useCallback(() => setTooltipOpen(false), [])

    //this is the function that bisects the date into a xy position
    const bisectDate = bisector((d: IRenderedSeries) => d.date).left

    //this is the function that decides the xy position of the tooltip based on the lines
    const showTooltipAt = useCallback((x: number, y: number) => {
        //we cant run the function if the scale is null
        if(xScale === null)
            return

        const positionX = x - margin.left
        const positionY = y - margin.top

        //now we need to check if the cursor is out of bounds
        if(positionX < 0 || positionY > xMax || positionY < 0 || positionY > yMax) {
            closeTooltip()
            return
        }

        //here is where we would get the width of the tooltip for box related calculations
        const dataPoints = renderedSeries.map((step) => {
            const xDomain = xScale.invert(x - margin.left)
            const index = bisectDate(step.data, xDomain, 1)

            const dataLeft = step.data[index - 1]
            const dataRight = step.data[index]
            if(dataLeft === undefined || dataRight === undefined)
                return

            const isRightCloser = xDomain.getTime() - dataLeft.date.getTime() > xDomain.getTime() - dataRight.date.getTime()

            return isRightCloser ? dataRight : dataLeft
        })

        //offsets for the tooltip
        const xOffset = 18
        const yOffset = 18

        //here is where we calculate tooltip values
        if(dataPoints[0] === undefined)
            return

        const lineLeft = xScale(dataPoints[0].date)

        //set the state
        setTooltipOpen(true)
        setLeftLinePos(lineLeft)
    }, [renderedSeries, xMax, yMax, margin, xScale])

    //this is a handler to handle when the mouse leaves the tooltip area
    const tooltipMouseLeave = useCallback((e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        closeTooltip()
    }, [])

    //this is the handler to handle a mouse move event over the tooltip area
    const tooltipMouseMove = useCallback((e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
        if(refreshRef.current === null)
            return

        const point = localPoint(refreshRef.current, e)
        if(point === null)
            return

        const {x, y} = point
        showTooltipAt(x, y)
    }, [showTooltipAt])

    //this is the handler that handles when the tooltip area has a touch event
    const tooltipTouchMove = useCallback((e: React.TouchEvent<SVGRectElement>) => {
        if(refreshRef.current === null)
            return

        const point = touchPoint(refreshRef.current, e)
        if(point === null)
            return

        const {x, y} = point
        showTooltipAt(x, y)
    }, [showTooltipAt])

    return {
        tooltipOpen,
        leftLinePos,
        tooltipMouseLeave,
        tooltipMouseMove,
        tooltipTouchMove
    }
}

export default useRefreshTooltip