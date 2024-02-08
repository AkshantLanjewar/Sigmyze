import { ScaleLinear } from "d3"
import { ISigmyzeMargin } from "../types"
import { AxisRight } from "@visx/axis"

interface ILunarRightAxisProps {
    /**
     * This is the width of the container
     */
    width: number,

    /**
     * This is the margin defined in the chart engine
     */
    margin: ISigmyzeMargin,

    /**
     * This is the scale that will render the ticks for the axis
     */
    rightScale: ScaleLinear<number, number, never>
}

const ILunarRightAxis: React.FC<ILunarRightAxisProps> = ({ width, margin, rightScale }) => {
    return (
        <g data-testId={'chart-y-axis'}>
            <AxisRight
                top={margin.top}
                left={width - 20}
                scale={rightScale}
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

export default ILunarRightAxis