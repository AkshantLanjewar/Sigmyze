import { ActionIcon, Tooltip } from '@mantine/core'
import { ISettingIndicator } from '.'
import styles from './settings.module.scss'
import { IconTrash } from '@tabler/icons'
import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react'
import { IQuantaIndicatorLoc } from '../../../../state'

interface IChartSettingsIndicatorProps {
    /**
     * this is the index 
     */
    index: number,

    /**
     * This is the indicator that is being rendered in the settings pane
     */
    indicator: ISettingIndicator,

    /**
     * This is the ref that tracks the active indicator during an event state change
     */
    eventIndicator: MutableRefObject<IQuantaIndicatorLoc | null>,

    /**
     * This is the function that sets the settings modal's current fragment
     */
    setFragmentId: Dispatch<SetStateAction<string | undefined>>
}

const ChartSettingsIndicator: React.FC<IChartSettingsIndicatorProps> = ({ index, indicator, eventIndicator, setFragmentId }) => {
    const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(eventIndicator.current !== null)
            return

        eventIndicator.current = indicator.indicatorLoc
        setFragmentId("delete::indicator")
    }, [indicator])
    
    return (
        <div
            data-testId={`chart-setting-indicator-${index}`}
            className={styles.indicator}
        >
            <div className={styles.text__wrapper}>
                <span className={styles.ball} />

                <div className={styles.name}>
                    {indicator.indicatorText.short}
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
                        onClick={e => onClick(e)}
                    >
                        <IconTrash style={{ width: '70%', height: '70%' }} stroke={2} />
                    </ActionIcon>
                </Tooltip>
            </div>
        </div>
    )
}

export default ChartSettingsIndicator