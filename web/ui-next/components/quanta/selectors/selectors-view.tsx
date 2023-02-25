import { Button, Group } from '@mantine/core'
import { IconAdjustments, IconPlus } from '@tabler/icons'
import { useContext, useState } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import SelectorPicker from '../selector-picker/selector-picker'
import styles from './selectors-view.module.scss'

const QuantaSelectorsView: React.FC = ({ }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    const selectors = quantaContext.project_data?.store?.selectors

    //handles which selector is active
    const [activeSelector, setActiveSelector] = useState<string | null>(null)
    
    return (
        <div className={styles.selectors__wrapper}>
            <div className={styles.selectors__list}>
                <div className={styles.title}>Dataset Selectors</div>

                {selectors?.map((step) => (
                    <SelectorPicker 
                        activeSelector={activeSelector}
                        selector={step}
                        setActiveSelector={setActiveSelector} 
                    />
                ))}

                <Button
                    color={"indigo"}
                    radius={"xl"}
                    onClick={() => { quantaContext.openModal("new_selector") }}
                >
                    <Group spacing={5}>
                        <IconAdjustments size={16} stroke={"2"} />
                        New Selector
                    </Group>
                </Button>
            </div>

            <div className={styles.selectors__viewport}>

            </div>
        </div>
    )
}

export default QuantaSelectorsView