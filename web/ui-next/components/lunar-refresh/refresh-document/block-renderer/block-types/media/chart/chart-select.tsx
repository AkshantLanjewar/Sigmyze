import { useCallback, useContext, useEffect, useState } from "react"
import { LunarDataManagerData } from "../../../../../data-manager"
import { ILunarDataManagerState, IQuantaIndicatorLoc } from "../../../../../data-manager/state"
import { IChartLoc } from "../types"
import { ScrollArea } from "@mantine/core"
import styles from './index.module.scss'
import { IconChartAreaLine } from "@tabler/icons"
import PortableRefreshChart from "../../../../../refresh-chart/portable"

interface IChartSelectStageProps {
    /**
     * This is the chart that is currently selected
     */
    selected: IChartLoc | undefined,

    /**
     * This is whether or not the width toggle is active
     */
    widthToggle: boolean,

    /**
     * This is the function to update the selected chart
     */
    setSelected: (val: IChartLoc | undefined) => void,

    /**
     * This is the function that sets the width toggle
     */
    setWidthToggle: (val: boolean) => void
}

const ChartSelectStage: React.FC<IChartSelectStageProps> = ({ selected, widthToggle, setSelected, setWidthToggle }) => {
    //these are the charts that are being rendered
    const [charts, setCharts] = useState<IChartLoc[]>([])
    //these are the indicators that have been selected
    const [indicators, setIndicators] = useState<IQuantaIndicatorLoc[] | undefined>(undefined)
    
    const { getCharts, getChartIndicators } = useContext(LunarDataManagerData) as ILunarDataManagerState

    //effect that fetches the charts to update the list
    useEffect(() => {
        const nCharts = getCharts()
        setCharts([ ...nCharts ])
    }, [getCharts])

    //effect that runs on selected to fetch the indicators
    useEffect(() => {
        if(selected === undefined) {
            setIndicators(undefined)
            return
        }

        let newIndicators = getChartIndicators(selected.fileId)
        setIndicators([ ...newIndicators ])
    }, [selected])

    /**
     * @description
     *  - this is the function that selects a chart within the list
     * @param val
     *  - this is the chart that is being selected
     */
    const selectChart = useCallback((val: IChartLoc) => {
        setSelected(val)
        setWidthToggle(true)
    }, [])

    return (
        <div className={styles.chart__wrapper}>
            <ScrollArea h={450} style={{ flexGrow: 1 }}>
                {charts.map((step) => (
                    <div 
                        className={`${styles.chart__option} ${step.fileId === selected?.fileId ? styles.active : null}`}
                        onClick={() => selectChart(step)}
                    >
                        <IconChartAreaLine size={22} />

                        <span>{step.title}</span>
                    </div>
                ))}
            </ScrollArea>

            {indicators !== undefined && (
                <div className={styles.chart__preview__wrapper}>
                    <div className={styles.chart__card}>
                        <PortableRefreshChart
                            indicators={indicators}
                            width={600}
                            height={300}
                            title={selected!.title}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChartSelectStage