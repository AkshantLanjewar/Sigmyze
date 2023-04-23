import { ActionIcon } from '@mantine/core'
import { IconCode } from '@tabler/icons'
import { useContext } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { IQuantaSelector } from '../../data/quanta/types/project'
import styles from './overview-selectors.module.scss'

interface IOverviewSelectorProps {
    selector?: IQuantaSelector
}

const OverviewSelector: React.FC<IOverviewSelectorProps> = ({ selector }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    
    return (
        <div className={styles.selector__item} onClick={() => quantaContext.openSelector(selector?.selectorId!)}>
            <ActionIcon className={styles.selector__icon} radius={"md"}>
                <IconCode size={48} stroke={"2"} />
            </ActionIcon>

            <div className={styles.selector__title}>
                {selector?.selectorName}
            </div>
        </div>
    )
}

export default OverviewSelector