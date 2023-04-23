import { Motion, spring } from "react-motion"
import { ID3Chart } from "../../engine/types"
import { getPathYFromX } from "../../engine/utils"
import { ITooltipState } from "../d3-tooltip"

interface ID3BallsProps {
    tooltipState: ITooltipState,
    pathRefs?: any,
    charts?: ID3Chart[]
}

const D3Balls: React.FC<ID3BallsProps> = ({ tooltipState, pathRefs, charts }) => {
    return (
        <g>
            {tooltipState.tooltipOpen && (
                <Motion
                    style={{
                        x: spring(tooltipState.vertLineLeft)
                    }}
                >
                    {style => tooltipState.tooltipData
                        ? (
                            <g>
                                {tooltipState.tooltipData.map((step, index) => {
                                    if(charts === undefined)
                                        return null
                                    if(pathRefs === undefined)
                                        return null
                                    if(step === undefined)
                                        return null
                                    
                                    const chart = charts[index]

                                    const chartsettings = chart.setting
                                    let chartColor = chart.color
                                    if(chartsettings !== undefined && chartsettings.lineColor !== undefined)
                                        chartColor = chartsettings.lineColor
                                    
                                    const ref = pathRefs[index]
                                    const y = getPathYFromX(style.x, ref, index.toString())

                                    return (
                                        <g>
                                            <circle
                                                cx={style.x}
                                                cy={y}
                                                r={12}
                                                fill={chartColor}
                                                stroke={chartColor}
                                                strokeWidth={'.3'}
                                                fillOpacity={1 / 12}
                                                strokeOpacity={0.5}
                                            />

                                            <circle
                                                cx={style.x}
                                                cy={y}
                                                r={4}
                                                fill={"white"}
                                                stroke={chartColor}
                                                strokeWidth={1.5}
                                                fillOpacity={1}
                                                strokeOpacity={1}
                                            />
                                        </g>
                                    )
                                })}
                            </g>
                        )
                        : <g></g>
                    }
                </Motion>
            )}
        </g>
    )
}

export default D3Balls