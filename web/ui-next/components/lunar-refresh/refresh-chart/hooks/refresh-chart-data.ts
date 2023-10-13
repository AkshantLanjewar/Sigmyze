import { useCallback, useEffect, useRef, useState } from "react"
import { useElementSize } from 'usehooks-ts'

/**
 * @description
 *  - this hook abstracts away all the state needed for the refresh chart
 * 
 * @emits chartTitle
 *  - this is the title of the chart
 * @emits containerRef
 *  - this is the ref for the parent container
 * @emits width
 *  - this is the width of the parent container
 * @emits height
 *  - this is the height of the parent container
 * @emits editChartTitle
 *  - function to edit the chart title
 *  - NOTE: not to be used by any other function other than a state update effect
 */
const useRefreshChartState = () => {
    //this is the title of the chart
    const [chartTitle, setChartTitle] = useState<string | undefined>(undefined)
    //this is the ref for the parent container
    const containerRef = useRef<HTMLDivElement | null>(null)

    //this is the height of the container
    const [height, setHeight] = useState(0)
    //this is the width of the container
    const [width, setWidth] = useState(0)

    const editChartTitle = useCallback((newTitle: string) => {
        setChartTitle(newTitle)
    }, [])

    //effect that handles the measurement of the height and width
    useEffect(() => {
        if(containerRef.current === null)
            return

        let container = containerRef.current
        let containerBox = container.getBoundingClientRect()
        //set the height
        let nHeight = containerBox.height - 8
        if(nHeight < 0)
            nHeight = 0

        setHeight(nHeight)
        //set the width
        setWidth(containerBox.width)

        //setup the resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            console.log(entries[0].contentRect.height)
        })

        //observe the element
        resizeObserver.observe(containerRef.current)
        return () => resizeObserver.unobserve(container)
    }, [])

    return {
        chartTitle,
        containerRef,
        height,
        width,
        editChartTitle
    }
}

export default useRefreshChartState