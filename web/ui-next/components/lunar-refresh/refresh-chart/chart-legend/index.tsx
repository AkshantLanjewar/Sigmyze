import { useContext, useEffect, useState } from 'react'
import { IQuantaIndicatorLoc } from '../../data-manager/state'
import styles from './index.module.scss'
import { QuantaDatasetManagerData } from '../../../ui/quanta-dataset-manager'
import { IDatasetManagerState } from '../../../ui/quanta-dataset-manager/types'

interface IChartLegendProps {
    /**
     * These are the indicators that will be rendered within the chart
     */
    indicators: IQuantaIndicatorLoc[]
}

const ChartLegend: React.FC<IChartLegendProps> = ({ indicators }) => {
    const [legendElements, setLegendElements] = useState<string[]>([])

    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

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
                    <div className={styles.ball} />
                    <b style={{ paddingTop: 2 }}>{step}</b>
                </div>
            ))}
        </div>
    )
}

export default ChartLegend