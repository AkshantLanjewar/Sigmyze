import { useContext, useEffect, useState } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { IQuantaSelector } from '../../data/quanta/types/project'
import styles from './selector-pane.module.scss'

const SelectorPane: React.FC = ({ }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    const selectors = quantaContext.project_data?.store?.selectors
    const activeSelector = quantaContext.activeSelectorId

    const [selector, setSelector] = useState<IQuantaSelector | null>(null)

    useEffect(() => {
        setSelector(null)
        if(activeSelector === undefined || activeSelector === null)
            return
        if(selectors === undefined)
            return

        let fSelector = null
        for(let i = 0; i < selectors.length; i++) {
            let selector_ = selectors[i]
            if(selector_.selectorId === activeSelector)
                fSelector = selector_
        }

        if(fSelector === null)
            return
        setSelector({ ...fSelector })
    }, [activeSelector])
    
    return (
        <>
            {selector && (
                <div className={styles.pane__wrapper}>
                    <div className={styles.title__section}>
                        <div className={styles.title__row}>

                        </div>

                        <div className={styles.description}>

                        </div>
                    </div>

                    <div className={styles.code__section}>

                    </div>

                    <div className={styles.schema__section}>

                    </div>

                    <div className={styles.preview__section}>

                    </div>
                </div>
            )}
        </>
    )
}

export default SelectorPane