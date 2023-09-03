import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from '../../ui/visualization/indicator-card.module.scss'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { QuantaIndicatorManagerData } from '../quanta-indicator-manager'
import { IQuantaIndicator, IQuantaIndicatorManager } from '../quanta-indicator-manager/types'
import QuantaFormattingEngine from '../../ui/formatting-engine'
import { Tooltip } from '@mantine/core'

interface IViewProps {
    title: string,
    short: string,
    formatter: (val: string) => string
}

const FormatterPreviewView: React.FC<IViewProps> = React.memo(({ title, short, formatter }) => {
    if(formatter === undefined)
        return null

    return (
        <div className={styles.indicator__card}>
            <div className={styles.indicator__chart}>

            </div>

            <div className={`${styles.indicator__title} ${styles.lighted}`}>
                <Tooltip
                    openDelay={250}
                    label={formatter(title)}
                    transition={"slide-up"}
                    position={"bottom"}
                    styles={{ tooltip: { backgroundColor: "#08090A", fontWeight: "bold" } }}
                    withArrow
                >
                    <div 
                        data-testId={"preview-title"}
                        className={styles.name}
                    >
                        {formatter(title)}
                    </div>
                </Tooltip>

                <Tooltip
                    openDelay={250}
                    label={formatter(short)}
                    transition={"slide-up"}
                    position={"bottom-start"}
                    styles={{ tooltip: { backgroundColor: "#08090A", fontWeight: "bold" } }}
                    withArrow
                >
                    <div 
                        data-testId={"preview-short"}
                        className={styles.indicator__id}
                    >
                        {formatter(short)}
                    </div>
                </Tooltip>
            </div>
        </div>
    )
})

const DEFAULT_TITLE_VALUE = "Type value in Title Text Field"
const DEFAULT_SHORT_VALUE = "Type value in Short Text Field"

const FormatterPreview: React.FC = ({ }) => {
    const [titleValue, setTitleValue] = useState<string>(DEFAULT_TITLE_VALUE)
    const [shortView, setShortView] = useState<string>(DEFAULT_SHORT_VALUE)

    const [indicator, setIndicator] = useState<IQuantaIndicator | undefined>(undefined)
    const [engine, setEngine] = useState<QuantaFormattingEngine | undefined>(undefined)

    const { textUpdated, textStore } = useContext(QuantaContextData) as IQuantaState
    const { indicators } = useContext(QuantaIndicatorManagerData) as IQuantaIndicatorManager

    //NOTE: Theese are the function's that receive the text value from the project context

    const fetchTitleValue = useCallback(() => {
        let storeKeys = Object.keys(textStore)
        if(storeKeys.includes('formatter::title') === false) {
            setTitleValue(DEFAULT_TITLE_VALUE)
            return
        }

        let titleValue = textStore['formatter::title']
        if(titleValue.length === 0)
            setTitleValue(DEFAULT_TITLE_VALUE)
        else
            setTitleValue(titleValue)
    }, [textStore])

    const fetchShortValue = useCallback(() => {
        let storeKeys = Object.keys(textStore)
        if(storeKeys.includes('formatter::short') === false) {
            setShortView(DEFAULT_SHORT_VALUE)
            return
        }

        let shortValue = textStore['formatter::short']
        if(shortValue.length === 0)
            setShortView(DEFAULT_SHORT_VALUE)
        else
            setShortView(shortValue)
    }, [textStore])

    //NOTE: This is the function used to format strings
    const formatterCallback = useCallback((val: string) => {
        if(engine === undefined)
            return val

        return engine.format(val)
    }, [engine])

    useEffect(() => {
        fetchTitleValue()
        fetchShortValue()
    }, [textStore])

    useEffect(() => {
        if(indicators.length === 0)
            return

        let selectedIndicator = indicators[0]
        setIndicator({ ...selectedIndicator })
    }, [indicators])

    useEffect(() => {
        if(indicator === undefined)
            return

        if(engine === undefined)
            setEngine(new QuantaFormattingEngine(indicator))
        else
            engine.changeInicator(indicator)
    }, [indicator])
    
    return <FormatterPreviewView title={titleValue} short={shortView} formatter={formatterCallback} />
}

export default FormatterPreview