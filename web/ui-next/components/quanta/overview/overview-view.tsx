import { ActionIcon, Button } from '@mantine/core'
import { IconPhotoPlus, IconPlayerPlay, IconWorldUpload } from '@tabler/icons'
import { useCallback, useContext, useState } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import EditableText from '../../ui/editable-text/editable-text'
import OverviewSelectors from '../overview-selectors/overview-selectors'
import OverviewTabs from '../overview-tabs/overview-tabs'
import styles from './overview-view.module.scss'
import SchemaEditor from '../schema-editor/schema-editor'
import CategoryMapper from '../category-mapper'
import Formatters from '../formatters'
import SelectorViewModal from '../selector-view/modal'
import PublishModal from './publish-modal'
import PublishButton from './publish-button'
import UnpublishModal from './unpublish-modal'

const QuantaOverviewView: React.FC = ({ }) => {
    const [previewOpen, setPreviewOpen] = useState(false)
    const closePreview = useCallback(() => setPreviewOpen(false), [])

    const [publishOpen, setPublishOpen] = useState(false)
    const closePublish = useCallback(() => setPublishOpen(false), [])

    const [unpublishOpen, setUnpublishOpen] = useState(false)
    const closeUnpublish = useCallback(() => setUnpublishOpen(false), [])

    const quantaContext = useContext(QuantaContextData) as IQuantaState
    const quantaProject = quantaContext.project_data

    return (
        <div className={styles.overviewWrapper}>
            <SelectorViewModal
                opened={previewOpen}
                close={closePreview}
            />

            <PublishModal
                opened={publishOpen}
                close={closePublish}
            />

            <UnpublishModal
                opened={unpublishOpen}
                close={closeUnpublish}
            />

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
                                value={quantaProject?.dataset_name} 
                                setValue={(val: string) => quantaContext.changeText(val, "title")}
                            />

                            <EditableText 
                                className={styles.overview__id} 
                                value={quantaProject?.dataset_id} 
                                setValue={(val: string) => quantaContext.changeText(val, "id")}
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            radius={"xl"}
                            color={"indigo"}
                            onClick={() => setPreviewOpen(true)}
                        >
                            <IconPlayerPlay 
                                size={14} 
                                style={{ marginRight: 2.5 }} 
                                fill='white'
                                fillOpacity={1}
                            />

                            Preview
                        </Button>

                        <PublishButton
                            setPublishOpen={setPublishOpen}
                            setUnpublishOpen={setUnpublishOpen}
                        />
                    </div>
                </div>

                <EditableText 
                    className={styles.overview__description} 
                    inputType={"textarea"}
                    value={quantaProject?.dataset_description} 
                    setValue={(val: string) => quantaContext.changeText(val, "desc")}
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

                <div className={styles.schema__container}>
                    <div className={styles.title}>Dataset Schema</div>
                    <SchemaEditor schemaId='dataset' viewOnly={true} />
                </div>

                <div className={styles.overview__selectors__row}>
                    <div className={styles.selector__title}>
                        <div className={styles.title}>Text Formatters</div>
                        <div className={styles.desc}>
                            How fields such as the display title and indicator id are constructed
                            from the indicator fields
                        </div>
                    </div>

                    <Formatters />
                </div>

                <div className={styles.schema__container}>
                    <div className={styles.title}>Dataset Categories</div>
                    <CategoryMapper />
                </div>
            </div>

            <OverviewTabs />
        </div>
    )
}

export default QuantaOverviewView