import { useContext, useEffect, useState } from 'react'
import styles from './settings.module.scss'
import { LunarUIContextData } from '../../../../ui-context'
import { ILunarUIState } from '../../../../ui-context/state'
import { LunarDataManagerData } from '../../..'
import { ILunarDataManagerState, IQuantaIndicatorLoc } from '../../../state'
import { IDatasetManagerState, IQuantaIndicatorText } from '../../../../../ui/quanta-dataset-manager/types'
import { QuantaDatasetManagerData } from '../../../../../ui/quanta-dataset-manager'
import { ActionIcon, Tooltip } from '@mantine/core'
import { IconTrash } from '@tabler/icons'

/**
 * This is the type definition for an indicator rendered within the settings fragment
 */
interface ISettingIndicator {
    /**
     * This is the dataset id and the indicator id used to access the indicator
     */
    indicatorLoc: IQuantaIndicatorLoc,

    /**
     * These are its precompiled texts that were fetched for the indicator
     */
    indicatorText: IQuantaIndicatorText
}

interface ISettingFragmentsProps {

}

const SettingsFragment: React.FC<ISettingFragmentsProps> = ({ }) => {
    //these are the RAW indicators that are currently rendered in the chart at the time of mount
    const [rawIndicators, setRawIndicators] = useState<IQuantaIndicatorLoc[]>([])

    //these are the indicators after they have been fetched
    const [indicators, setIndicators] = useState<ISettingIndicator[]>([])
    
    const { activeFile } = useContext(LunarUIContextData) as ILunarUIState
    const { getChartIndicators } = useContext(LunarDataManagerData) as ILunarDataManagerState
    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    /**
     * This is the effect that handles fetching the raw indicators from the chart
     */
    useEffect(() => {
        if(activeFile === null)
            return

        let nRawIndicators = getChartIndicators(activeFile)
        setRawIndicators([ ...nRawIndicators ])
    }, [activeFile])

    /**
     * this is the effect that fetches the indicators when the raw indicators are updated
     */
    useEffect(() => {
        async function main() {
            let newIndicators: ISettingIndicator[] = []
            for(let i = 0; i < rawIndicators.length; i++) {
                let rawIndicator = rawIndicators[i]
                let indicatorText = await fetchIndicatorText(rawIndicator.datasetId, rawIndicator.indicatorId)
                if(indicatorText === undefined)
                    continue

                newIndicators.push({
                    indicatorLoc: rawIndicator,
                    indicatorText
                })
            }

            setIndicators([ ...newIndicators ])
        }

        main()
    }, [rawIndicators])

    return (
        <div data-testId={"chart-settings-modal"}>
            <div
                data-testId={"section-0"}
                className={styles.section}
            >
                <div 
                    data-testId={"section-title"}
                    className={styles.title}
                >
                    Chart Indicators
                </div>

                <div 
                    data-testId={"chart-indicator-settings"}
                    className={`${styles.indicators}`}
                >
                    {indicators.map((step, index) => (
                        <div
                            data-testId={`chart-setting-indicator-${index}`}
                            className={styles.indicator}
                        >
                            <div className={styles.text__wrapper}>
                                <span className={styles.ball} />
                                
                                <div className={styles.name}>
                                    {step.indicatorText.short}
                                </div>
                            </div>

                            <div className={styles.action__wrapper}>
                                <Tooltip
                                    position={"bottom"}
                                    color={"dark"}
                                    offset={10}
                                    withArrow
                                    label={"Delete Indicator"}
                                    openDelay={100}
                                    transitionDuration={300}
                                    transition={"slide-down"}
                                >
                                    <ActionIcon
                                        size={"md"}
                                        radius={"sm"}
                                        variant={"subtle"}
                                        color='red'
                                        data-testId={"indicator-delete"}
                                    >
                                        <IconTrash style={{ width: '70%', height: '70%' }} stroke={2} />
                                    </ActionIcon>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SettingsFragment