import { Button } from '@mantine/core'
import { IconAdjustments } from '@tabler/icons'
import styles from './selector-picker.module.scss'

const SelectorPicker: React.FC = ({ }) => {
    return (
        <div className={styles.selector__picker}>
            <IconAdjustments 
                size={24} 
                stroke={"2"} 
                color={"#909296"} 
            />

            <div className={styles.content}>
                <div className={styles.title__row}>
                    <div className={styles.title}>Selector Title</div>
                </div>

                <div className={styles.description}>
                    This is the description for the selector, type anything in here
                </div>
            </div>
        </div>
    )
}

export default SelectorPicker