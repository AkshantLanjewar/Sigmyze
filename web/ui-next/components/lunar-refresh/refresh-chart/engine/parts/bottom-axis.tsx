import { ScaleTime } from "d3"
import { ISigmyzeMargin } from "../types"
import { AxisBottom } from "@visx/axis"

interface ILunarBottomAxisProps {
    /**
     * This is the height of the chart
     */
    height: number,
    
    /**
     * This is the margin defined in the chart engine
     */
    margin: ISigmyzeMargin,

    /**
     * this is the scale that will render the ticks on the axis
     */
    dateScale: ScaleTime<number, number, never>
}

const ILunarBottomAxis: React.FC<ILunarBottomAxisProps> = ({ height, margin, dateScale }) => {
    return (
        <g data-testId={'chart-x-axis'}>
            <AxisBottom
                top={height - margin.bottom}
                left={margin.left}
                scale={dateScale!}
                hideTicks
                stroke='#909296'
                tickLabelProps={{
                    fill: "#909296",
                    fontSize: "12px",
                    textAnchor: "middle",
                    fontWeight: "bold",
                    dy: "0.25em",
                    color: "#C1C2C5",
                    fontFamily: "Poppins"
                }}
            />
        </g>
)
}

export default ILunarBottomAxis