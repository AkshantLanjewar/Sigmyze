import { ActionIcon, Button } from '@mantine/core'
import { IconPhotoPlus, IconPlayerPlay } from '@tabler/icons'
import OverviewSelectors from '../overview-selectors/overview-selectors'
import styles from './overview-view.module.scss'

const QuantaOverviewView: React.FC = ({ }) => {
    return (
        <div className={styles.overviewWrapper}>
            <div className={styles.overview__content}>
                <div className={styles.overview__title__row}>
                    <div className={styles.text}>
                        <ActionIcon
                            variant={'filled'}
                            color={"blue"}
                            size={"xl"}
                            radius={"md"}
                            sx={{ width: 60, height: 60 }}
                        >
                            <IconPhotoPlus size={32} stroke={"2"} />
                        </ActionIcon>

                        <div className={styles.content}>
                            <div className={styles.overview__title}>Dataset Title</div>
                            <div className={styles.overview__id}>dataset_access_id</div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            radius={"xl"}
                            color={"indigo"}
                            disabled
                        >
                            <IconPlayerPlay size={14} style={{ marginRight: 2.5 }} />

                            Update
                        </Button>

                        <Button
                            radius={"xl"}
                            color={"indigo"}
                            disabled
                        >
                            <IconPlayerPlay  size={14} style={{ marginRight: 2.5 }} />

                            Create
                        </Button>
                    </div>
                </div>

                <div className={styles.overview__description}>
                    This is the description for the dataset. It is written by the user and it contains important 
                    info like whyu the dataset is important
                </div>

                <div className={styles.overview__selectors__row}>
                    <div className={styles.selector__title}>
                        <div className={styles.title}>Selectors</div>
                        <div className={styles.desc}>This is how users query your Dataset</div>
                    </div>

                    <div>
                        <OverviewSelectors />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuantaOverviewView