import { useEffect, useState } from "react"
import { IQuantaIndicatorLoc } from "../../data-manager/state"
import RefreshEngine from "../engine"
import StaticTitle from "../chart-title/static"

interface IPortableRefreshChartProps {
    /**
     * These are the indicators to be rendered
     */
    indicators: IQuantaIndicatorLoc[],

    /**
     * This is the width of the container the chart is being rendered in
     */
    width: number,

    /**
     * This is the height of the container the chart is being rendered in
     */
    height: number,

    /**
     * This is the title of the chart
     */
    title: string,

    /**
     * this is the optional switch to hide the xAxis
     */
    hideXAxis?: boolean,

    /**
     * this is the optional switch to hide the yAxis
     */
    hideYAxis?: boolean,

    /**
     * This is the optional switch to invert the yAxis
     */
    invertYAxis?: boolean,

    /**
     * show the title
     */
    showTitle?: boolean,

    /**
     * This is the custom background color
     */
    customBg?: string
}

const PortableRefreshChart: React.FC<IPortableRefreshChartProps> = ({ 
    indicators, 
    width, 
    height, 
    title,
    hideXAxis,
    hideYAxis,
    invertYAxis,
    showTitle,
    customBg 
}) => {
    //whether or not to display the title
    const [displayTitle, setDisplayTitle] = useState<boolean>(false)

    //effect to set the displayTitle state
    useEffect(() => {
        if(showTitle === undefined)
            return

        setDisplayTitle(showTitle)
    }, [showTitle])

    return (
        <div
            data-testId={"refresh-chart"}
            style={{
                height: height,
                width: width,
                background: "#101113",
                display: "block",
                position: 'relative',
                borderRadius: 8
            }}
        >
            {displayTitle
                ? <StaticTitle chartTitle={title} />
                : null
            }
            
            <RefreshEngine
                height={height}
                width={width}
                indicators={indicators}
                hideXAxis={hideXAxis}
                hideYAxis={hideYAxis}
                invertYAxis={invertYAxis}
                customBg={customBg}
            />
        </div>
    )
}

export default PortableRefreshChart