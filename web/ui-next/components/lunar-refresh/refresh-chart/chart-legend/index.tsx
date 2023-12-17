import { useContext, useEffect, useState } from 'react'
import { ILunarDataManagerState, IQuantaIndicatorLoc } from '../../data-manager/state'
import styles from './index.module.scss'
import { QuantaDatasetManagerData } from '../../../ui/quanta-dataset-manager'
import { IDatasetManagerState } from '../../../ui/quanta-dataset-manager/types'
import { ActionIcon, Tooltip } from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import { LunarDataManagerData } from '../../data-manager'
import { LunarUIContextData } from '../../ui-context'
import { ILunarUIState } from '../../ui-context/state'

interface IChartLegendProps {
    /**
     * These are the indicators that will be rendered within the chart
     */
    indicators: IQuantaIndicatorLoc[]
}

const ChartLegend: React.FC<IChartLegendProps> = ({ indicators }) => {
    const [legendElements, setLegendElements] = useState<string[]>([])

    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    const { setEventIndicator } = useContext(LunarDataManagerData) as ILunarDataManagerState
    const { openDeleteIndicatorFlow } = useContext(LunarUIContextData) as ILunarUIState

    useEffect(() => {
        async function main() {
            let newLegendElements: string[] = []
            for(let i = 0; i < indicators.length; i++) {
                let indicator = indicators[i]
                let indicatorText = await fetchIndicatorText(indicator.datasetId, indicator.indicatorId)
                if(indicatorText === undefined)
                    continue

                newLegendElements.push(indicatorText.short)
            }

            setLegendElements([ ...newLegendElements ])
        }

        main()
    }, [indicators])

    //TODO: add a tooltip with the long name aswell

    return (
        <div className={styles.legend__container} data-testId={"legend"}>
            {legendElements.map((step, index) => (
                <div className={styles.legend__element} data-testId={`legend-item-${index}`}>
                    <div className={styles.legend__text}>
                        <div className={styles.ball} />
                        <b style={{ paddingTop: 2 }}>{step}</b>
                    </div>

                    <div className={styles.legend__actions}>
                        <Tooltip
                            position={"bottom"}
                            offset={10}
                            withArrow
                            label={"Delete Indicator"}
                            openDelay={100}
                            transitionDuration={300}
                            transition={"slide-down"}
                        >
                            <ActionIcon
                                size={"sm"}
                                radius={"sm"}
                                variant={"subtle"}
                                color='red'
                                data-testId={"legend-delete"}
                                onClick={(e) => {
                                    e.stopPropagation()

                                    setEventIndicator({ ...indicators[index] })
                                    openDeleteIndicatorFlow()
                                }}
                            >
                                <IconTrash style={{ width: '70%', height: '70%' }} stroke={2} />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChartLegend