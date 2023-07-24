import { memo } from "react";
import { ITooltipState } from "../d3-chart/d3-tooltip";
import { IChartMargin, ID3Chart, IQuantaChart } from "../engine/types";
import QIndicatorTitleItem from "./title-item";

interface ID3RenderTitleProps {
    margin: IChartMargin,
    indicators?: ID3Chart[],
    tooltipData: ITooltipState,
    charts?: IQuantaChart[]
}

const QD3RenderTitle: React.FC<ID3RenderTitleProps> = memo(({
    margin,
    indicators,
    tooltipData,
    charts
}) => (
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
                <QIndicatorTitleItem
                    setting={setting}
                    index={index}
                    tooltipData={tooltipData}
                    charts={charts}
                />
            )
        })}
    </div>
))

export default QD3RenderTitle