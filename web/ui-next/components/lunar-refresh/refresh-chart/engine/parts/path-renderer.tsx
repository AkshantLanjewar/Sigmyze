import { CurveFactory, ScaleLinear, ScaleTime } from "d3"
import { IQuantaSeries } from "../hooks/quanta-data"
import { LinePath } from "@visx/shape"

interface IPathRendererProps {
    /**
     * Theese are the series that we are going to end up rendering
     */
    renderedSeries: IQuantaSeries[],
    
    /**
     * This is the date scale used to render the path
     */
    dateScale: ScaleTime<number, number, never>,

    /**
     * this is the numerical scale used to render the path
     */
    rightScale: ScaleLinear<number, number, never>,

    /**
     * this is the type of curve we want on the path
     */
    curveBasis: CurveFactory

    /**
     * this is the function that collects the ref for the root container
     */
    collectLineRef: (element: SVGPathElement | null, index: number) => void,
}

const PathRenderer: React.FC<IPathRendererProps> = ({ 
    renderedSeries, 
    dateScale, 
    rightScale, 
    curveBasis,
    collectLineRef 
}) => {
    return (
        <>
            <g id="line-renderer">
                {renderedSeries.map((step, index) => (
                    <LinePath
                        key={`${index}-${step.indicatorId}`}
                        innerRef={(e) => collectLineRef(e, index)}
                        data={step.data}
                        x={(d) => dateScale!(d.date)}
                        y={(d) => rightScale!(d.value)}
                        curve={curveBasis}
                        strokeLinecap="round"
                        stroke='#5865f2'
                        shapeRendering="geometricPrecision"
                    />
                ))}
            </g>
        </>
    )
}

export default PathRenderer