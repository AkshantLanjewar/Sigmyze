import { ActionIcon, Tooltip } from '@mantine/core'
import { IconCode, IconCodePlus } from '@tabler/icons'
import styles from './overview-selectors.module.scss'

const OverviewSelectors: React.FC = ({ }) => {
    return (
        <div className={styles.selectors__view}>
            <div className={styles.selector__item}>
                <ActionIcon className={styles.selector__icon} radius={"md"}>
                    <IconCode size={48} stroke={"2"} />
                </ActionIcon>

                <div className={styles.selector__title}>
                    Selector Name
                </div>
            </div>

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