import { IQuantaIndicatorLoc } from "../../data-manager/state"
import RefreshEngine from "../engine"

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
    title: string
}

const PortableRefreshChart: React.FC<IPortableRefreshChartProps> = ({ indicators, width, height, title }) => {
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
            <RefreshEngine
                height={height}
                width={width}
                indicators={indicators}
            />
        </div>
    )
}

export default PortableRefreshChart