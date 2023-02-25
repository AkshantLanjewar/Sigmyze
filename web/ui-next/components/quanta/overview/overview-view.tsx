import { ActionIcon, Button } from '@mantine/core'
import { IconPhotoPlus, IconPlayerPlay } from '@tabler/icons'
import EditableText from '../../ui/editable-text/editable-text'
import OverviewSelectors from '../overview-selectors/overview-selectors'
import OverviewTabs from '../overview-tabs/overview-tabs'
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
                            <EditableText 
                                className={styles.overview__title} 
                                value={"Dataset Title"} 
                            />

                            <EditableText 
                                className={styles.overview__id} 
                                value={"dataset_access_id"} 
                            />
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

                <EditableText 
                    className={styles.overview__description} 
                    inputType={"textarea"}
                    value={"This is the description for the dataset. It is written by the user and it contains important info like whyu the dataset is important"} 
                />

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

            <OverviewTabs />
        </div>
    )
}

export default QuantaOverviewView