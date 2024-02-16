import { useEffect, useState } from "react"

/**
 * @description
 *  - this is the function that encapsulates all the state relating to custom options within the chart engine
 * @param hideXAxis
 *  - this is the optional switch to hide the xAxis
 * @param hideYAxis
 *  - this is the optional switch to hide the yAxis
 * @param invertYAxis
 *  - This is the optional switch to invert the yAxis
 */
const useCustomOptions = (
    hideXAxis?: boolean,
    hideYAxis?: boolean,
    invertYAxis?: boolean
) => {
    //this is the state that hides the horizontal axis
    const [hideHorizontal, setHideHorizontal] = useState<boolean>(false)

    //this is the state that hides the vertical axis
    const [hideVertical, setHideVertical] = useState<boolean>(false)

    //this is the state that inverts the vertical axis
    const [invertVertical, setInvertVertical] = useState<boolean>(false)

    //effect that handles the setting of hideHorizontal
    useEffect(() => {
        if(hideXAxis === undefined)
            return

        setHideHorizontal(hideXAxis)
    }, [hideXAxis])

    //effect that handles the setting of hideVertical
    useEffect(() => {
        if(hideYAxis === undefined)
            return

        setHideVertical(hideYAxis)
    }, [hideYAxis])

    //effect that handles the setting of invertVertical
    useEffect(() => {
        if(invertYAxis === undefined)
            return

        setInvertVertical(invertYAxis)
    }, [invertYAxis])

    return {
        hideHorizontal,
        hideVertical,
        invertVertical
    }
}

export default useCustomOptions