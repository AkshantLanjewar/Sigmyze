import { ActionIcon, Tooltip } from '@mantine/core'
import { IconCode, IconCodePlus } from '@tabler/icons'
import { useContext } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import OverviewSelector from './overview-selector'
import styles from './overview-selectors.module.scss'

const OverviewSelectors: React.FC = ({ }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    const selectors = quantaContext.project_data?.store?.selectors
    
    return (
        <div className={styles.selectors__view}>
            {selectors?.map((step) => (
                <OverviewSelector />
            ))}

            <div className={styles.selector__item}>
                <Tooltip
                    label={"Create Selector"}
                    position={"bottom"}
                    withArrow
                    styles={{ tooltip: { backgroundColor: "#08090A" } }}
                >
                    <ActionIcon className={styles.selector__icon} radius={"md"}>
                        <IconCodePlus size={48} stroke={"2"} />
                    </ActionIcon> 
                </Tooltip>  
            </div>
        </div>
    )
}

export default OverviewSelectors