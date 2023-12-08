import { Motion, spring } from "react-motion"
import { IQuantaSeries } from "../hooks/quanta-data"

interface IBallRendererProps {
    /**
     * This is the position of the left line in the editor
     */
    leftLinePos: number,

    /**
     * whether or not the tooltip is open
     */
    tooltipOpen: boolean,

    /**
     * the series that are being rendered within the engine
     */
    renderedSeries: IQuantaSeries[],

    /**
     * function that gets the y coordinate of a path based on the current x
     */
    getPathYFromXCB: (index: number, x: number) => any
}

const BallRenderer: React.FC<IBallRendererProps> = ({
    leftLinePos,
    tooltipOpen,
    renderedSeries,
    getPathYFromXCB
}) => {
    return (
        <Motion
            defaultStyle={{ opacity: 0, x: leftLinePos }}
            style={{
                opacity: spring(tooltipOpen ? 1 : 0),
                x: spring(leftLinePos)
            }}
        >
            {(style) => (
                <g>
                    {renderedSeries.map((step, index) => {
                        const y = getPathYFromXCB(index, style.x)

                        return (
                            <g>
                                <circle 
                                    cx={style.x}
                                    cy={y}
                                    r={12}
                                    fill='rgb(107, 157, 255)'
                                    stroke='rgb(107, 157, 255)'
                                    strokeWidth={0.6}
                                    fillOpacity={style.opacity / 12}
                                    strokeOpacity={style.opacity / 2}
                                />

                                <circle 
                                    cx={style.x}
                                    cy={y}
                                    r={4}
                                    fill="white"
                                    stroke='rgb(107, 157, 255)'
                                    strokeWidth={1.5}
                                    fillOpacity={style.opacity}
                                    strokeOpacity={style.opacity}
                                />
                            </g>
                        )
                    })}
                </g>
            )}
        </Motion>
    )
}

export default BallRenderer