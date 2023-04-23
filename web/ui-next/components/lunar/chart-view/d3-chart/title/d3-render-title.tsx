import { IChartMargin, ID3Chart, ILunarChart } from "../../engine/types"
import { ITooltipState } from "../d3-tooltip"
import { IndicatorTitleItem } from "./d3-chart-title"

interface ID3RenderTitleProps {
    margin: IChartMargin,
    indicators?: ID3Chart[],
    tooltipData: ITooltipState,
    charts?: ILunarChart[]
}

const D3RenderTitle: React.FC<ID3RenderTitleProps> = ({ margin, indicators, tooltipData, charts }) => {
    return (
        <div style={{
            position: 'absolute',
            top: margin.top,
            left: margin.left,

            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
        }}>
            {indicators?.map((step, index) => {
                let setting = step.setting
                if(setting === undefined)
                    return null

                return (
                    <IndicatorTitleItem
                        setting={setting}
                        index={index}
                        tooltipData={tooltipData}
                        charts={charts}
                    />
                )
            })}
        </div>
    )
}

export default D3RenderTitle