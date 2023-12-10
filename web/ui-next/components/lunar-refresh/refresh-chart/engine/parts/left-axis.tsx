import { ScaleLinear } from "d3"
import { ISigmyzeMargin } from "../types"
import { AxisLeft } from "@visx/axis"

interface ILunarLeftAxisProps {
    /**
     * This is the margin defined in the chart engine
     */
    margin: ISigmyzeMargin,

    /**
     * This is the scale that will render the ticks for the axis
     */
    rightScale: ScaleLinear<number, number, never>
}

const ILunarLeftAxis: React.FC<ILunarLeftAxisProps> = ({ margin, rightScale }) => {
    return (
        <g data-testId={'chart-y-axis'}>
            <AxisLeft
                top={margin.top}
                left={margin.left}
                scale={rightScale!}
                hideTicks
                hideAxisLine
                numTicks={3}
                stroke="#909296"
                tickFormat={rightScale!.tickFormat(3, "0")}
                tickLabelProps={{
                    fill: "#909296",
                    fontSize: "12px",
                    textAnchor: "end",
                    fontWeight: "bold",
                    dy: "0.25em",
                    color: "#C1C2C5",
                    fontFamily: "Poppins"
                }}
            />
        </g>
    )
}

export default ILunarLeftAxis