import { memo, useEffect, useState } from "react";
import { IIndicatorSetting } from "../../../data/lunar/types/chart-types";
import { ITooltipState } from "../d3-chart/d3-tooltip";
import { IQuantaChart } from "../engine/types";
import styles from '../d3-chart/title/d3-chart-title.module.scss'
import { Group, Text } from "@mantine/core";

interface IViewProps {
    setting: IIndicatorSetting,
    title: string | undefined,
    indicatorValue: number | null
}

const View: React.FC<IViewProps> = memo(({
    setting,
    title,
    indicatorValue
}) => (
    <div className={styles.clickItem}>
        <Group position='apart'>
            <Group position={'apart'} spacing={5}>
                <div 
                    className={styles.dot} 
                    style={{
                        backgroundColor: setting.lineColor ? setting.lineColor : 'inherit'
                    }}
                />

                <Text
                    size={"sm"}
                    weight={"bold"}
                >
                    {indicatorValue}
                </Text>
            </Group>

            <Text
                size={"xs"}
                weight={"bold"}
                transform={"uppercase"}
            >
                {indicatorValue}
            </Text>
        </Group>
    </div>
))

interface IIndicatorTitleItemProps {
    setting: IIndicatorSetting,
    index: number,
    tooltipData: ITooltipState,
    charts?: IQuantaChart[]
}

const QIndicatorTitleItem: React.FC<IIndicatorTitleItemProps> = ({
    setting,
    index,
    tooltipData,
    charts
}) => {
    const [indicatorValue, setIndicatorValue] = useState<number | null>(null)
    const [titleValue, setTitleValue] = useState<string | undefined>(undefined)

    useEffect(() => {
        let data = tooltipData.tooltipData
        if(data === undefined)
            return

        let item = data[index]
        if(item === undefined)
            setIndicatorValue(null)
        else
            setIndicatorValue(item.value)
    }, [tooltipData])

    useEffect(() => {
        if(charts === undefined || tooltipData.tooltipOpen === true)
            return

        let chart = charts[index]
        let data = chart.data
        
        setIndicatorValue(data[data.length - 1].value)
    }, [tooltipData, index])

    useEffect(() => {
        if(charts === undefined)
            return

        let chart = charts[index]
        let datasetId = chart.datasetId
        let indicatorId = chart.indicator.indicatorId
        if(indicatorId === undefined)
            return

        setTitleValue(`${datasetId}::${indicatorId}`)
    }, [index, charts])

    return (
        <View
            setting={setting}
            title={titleValue}
            indicatorValue={indicatorValue}
        />
    )
}

export default QIndicatorTitleItem