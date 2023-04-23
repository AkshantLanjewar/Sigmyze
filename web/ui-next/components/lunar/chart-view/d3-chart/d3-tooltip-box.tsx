import { Text } from "@mantine/core"
import { forwardRef, useEffect, useState } from "react"
import { Motion, spring } from "react-motion"
import { date_locale, date_options, toLocaleUTCDateString } from "../../../chart/utils"
import { ChartDims, IChartMargin, ID3Chart } from "../engine/types"
import { ITooltipState } from "./d3-tooltip"
import styles from './d3-tooltip-box.module.scss'

interface ID3TooltipBoxProps {
    margin: IChartMargin,
    dims: ChartDims,
    tooltipData: ITooltipState,
    charts?: ID3Chart[]
}

interface ITooltipView {
    color: string,
    name: string,
    val: number
}

type Ref = HTMLDivElement

const D3TooltipBox = forwardRef<Ref, ID3TooltipBoxProps>((props, ref) => {
    const { margin, dims, tooltipData, charts } = props
    const [selectedDate, setSelectedData] = useState<Date>(new Date())
    const [tooltipView, setTooltipView] = useState([] as ITooltipView[])

    useEffect(() => {
        let data = tooltipData.tooltipData
        if(data === undefined)
            return
        if(charts === undefined)
            return

        let point = data[tooltipData.longestIndex]
        let date = point.date
        let tooltipViewData = [] as ITooltipView[]

        for(let i = 0; i < data.length; i++) {
            let slice = data[i]
            let chart = charts[i]
            if(slice === undefined)
                continue
            if(slice.value === null)
                continue

            //calculate color setting
            let tooltipColor = chart.color
            let chartSetting = chart.setting
            if(chartSetting !== undefined && chartSetting.lineColor !== undefined)
                tooltipColor = chartSetting.lineColor

            tooltipViewData.push({
                color: tooltipColor,
                name: chart.name,
                val: slice.value
            })
        }

        setSelectedData(date)
        setTooltipView([ ...tooltipViewData ])
    }, [tooltipData])

    return (
        <div
            style={{
                position: 'absolute',
                pointerEvents: 'none',

                top: margin.top,
                left: margin.left,
                width: dims.x,
                height: dims.y
            }}
        >
            <Motion
                style={{
                    left: spring(tooltipData.tooltipLeft || 0),
                    top: spring(tooltipData.tooltipTop || 0),
                    opacity: spring(tooltipData.tooltipOpen ? 1 : 0)
                }}
            >
                {style => (
                    <div
                        className={styles.tooltip}
                        ref={ref}
                        style={{
                            top: style.top,
                            left: style.left,
                            opacity: style.opacity  
                        }}
                    >
                        <div className={styles.header}>
                            <Text size={"sm"} weight={"bold"}>
                                {toLocaleUTCDateString(selectedDate,date_locale, date_options as any)}
                            </Text>
                        </div>

                        <div className={styles.body}>
                            {tooltipView.map((step) => (
                                <div className={styles.item}>
                                    <div className={styles.text}>
                                        <div 
                                            className={styles.dot} 
                                            style={{ backgroundColor: step.color }}
                                        />

                                        <Text size={"sm"}>
                                            {step.name}
                                        </Text>
                                    </div>

                                    <Text
                                        size={"xs"}
                                        transform={"uppercase"}
                                        weight={"bold"}
                                    >
                                        {step.val}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Motion>
        </div>
    )
})

export default D3TooltipBox