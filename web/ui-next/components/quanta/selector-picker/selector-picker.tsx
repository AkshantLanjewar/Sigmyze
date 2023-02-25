import { Button } from '@mantine/core'
import { IconAdjustments } from '@tabler/icons'
import { IQuantaSelector } from '../../data/quanta/types/project'
import styles from './selector-picker.module.scss'

interface ISelectorPickerProps {
    activeSelector: string | null | undefined,
    selector: IQuantaSelector,
    setActiveSelector: (selectorId: string) => void
}

const SelectorPicker: React.FC<ISelectorPickerProps> = ({ activeSelector, selector, setActiveSelector }) => {
    return (
        <div 
            className={`${styles.selector__picker} ${activeSelector === selector.selectorId && styles.active}`} 
            onClick={() => setActiveSelector(selector.selectorId!)}
        >
            <IconAdjustments 
                size={24} 
                stroke={"2"} 
                color={"#909296"} 
            />

            <div className={styles.content}>
                <div className={styles.title__row}>
                    <div className={styles.title}>{selector.selectorName}</div>
                </div>

                <div className={styles.description}>
                    {selector.selectorDescription}
                </div>
            </div>
        </div>
    )
}

export default SelectorPicker