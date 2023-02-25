import { ActionIcon } from '@mantine/core'
import { IconCode } from '@tabler/icons'
import styles from './overview-selectors.module.scss'

const OverviewSelector: React.FC = ({ }) => {
    return (
        <div className={styles.selector__item}>
            <ActionIcon className={styles.selector__icon} radius={"md"}>
                <IconCode size={48} stroke={"2"} />
            </ActionIcon>

            <div className={styles.selector__title}>
                Selector Name
            </div>
        </div>
    )
}

export default OverviewSelector