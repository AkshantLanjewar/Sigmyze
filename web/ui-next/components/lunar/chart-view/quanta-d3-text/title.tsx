import { memo, useContext, useEffect, useMemo, useState } from "react";
import { IGlobalChartSettings } from "../../../data/lunar/types/chart-types";
import { ITooltipState } from "../d3-chart/d3-tooltip";
import { IChartMargin, ID3Chart, IQuantaChart } from "../engine/types";
import { LunarContextData } from "../../../data/lunar/context";
import { ILunarState, ILunarUIData } from "../../../data/lunar/types/types";
import { ClickItem } from "../d3-chart/title/d3-chart-title";
import QIndicatorTitleItem from "./title-item";

interface IViewProps {
    margin: IChartMargin,
    innerMargin: IChartMargin,
    ui: ILunarUIData | null | undefined,
    chartTitle: string,
    nodeId: string | null,
    indicators: ID3Chart[] | undefined,
    tooltipData: ITooltipState,
    charts: IQuantaChart[] | undefined
    setChartTitle: Function,
}

const View: React.FC<IViewProps> = memo(({
    margin,
    innerMargin,
    ui,
    chartTitle,
    nodeId,
    indicators,
    tooltipData,
    charts,
    setChartTitle
}) => (
    <div
        style={{
            position: 'absolute',
            top: margin.top + innerMargin.top,
            left: margin.left + innerMargin.left,

            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
        }}
    >
        <ClickItem
            ui={ui}
            value={chartTitle}
            size={"lg"}
            weight={"bold"}
            type={"chart-title"}
            setChartTitle={setChartTitle}
            nodeId={nodeId}
        />

        {indicators?.map((step, index) => {
                let setting = step.setting ? step.setting : null
                if(setting === null)
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

interface ID3ChartTitleProps {
    margin: IChartMargin,
    globals?: IGlobalChartSettings,
    indicators?: ID3Chart[],
    tooltipData: ITooltipState,
    charts?: IQuantaChart[],
    mutable?: boolean
}

const QD3ChartTitle: React.FC<ID3ChartTitleProps> = ({
    margin,
    globals,
    indicators,
    tooltipData,
    charts,
    mutable
}) => {
    const [chartTitle, setChartTitleLocal] = useState<string>("")
    const [nodeId, setNodeId] = useState<string | null>(null)

    const { ui, getNodeIdTab, setChartTitle } = useContext(LunarContextData) as ILunarState

    const innerMargin: IChartMargin = useMemo(() => ({
        left: 0,
        top: 20,
        right: 0,
        bottom: 0
    }), [])

    useEffect(() => {
        let activeTab = ui?.activeTab
        if(activeTab === null || activeTab === undefined)
            return

        let _nodeId = getNodeIdTab(activeTab)
        setNodeId(_nodeId)
    }, [ui])

    useEffect(() => {
        let nChartTitle = globals?.chartTitle
        if(nChartTitle === undefined)
            return

        setChartTitleLocal(nChartTitle)
    }, [globals])

    return (
        <View
            margin={margin}
            indicators={indicators}
            innerMargin={innerMargin}
            chartTitle={chartTitle}
            ui={ui}
            charts={charts}
            tooltipData={tooltipData}
            nodeId={nodeId}
            setChartTitle={setChartTitle}
        />
    )
}


export default QD3ChartTitle