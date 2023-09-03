import { ActionIcon, Button } from '@mantine/core'
import { IconPhotoPlus, IconPlayerPlay, IconWorldUpload } from '@tabler/icons'
import { useCallback, useContext, useEffect, useState } from 'react'
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

/**
 *  NOTE: Here are all the testing requirements for the overview page and its related subcomponents in this directory
 *  The overview view contains tests for a lot of varied components, and as such, needs to be split up into groups
 *  of unit tests that need to be written
 * 
 *  Unit Tests:
 *      PreviewButton Unit Test
 *          - check that previewbutton = Preview
 *      SelectorViewModal Unit Test  
 *          - cancel-preview = Cancel 
 * 
 *      PublishButton Unit Test
 *          - check that publish-button = Publish
 *      PublishModal Unit Test
 *          - title-input = Dataset Title
 *          - dataset-id = Dataset ID
 *          - dataset-description = Dataset Description
 *          - dataset-semgent = Public & Local
 *  OverviewBaseE2E Tests:
 *      PreviewButton E2E Test
 *          - check if preview modal has opened
 *      PublishButton E2E Test
 *          - check if publish modal has opened
 *  
 *  BaseLocators:
 *      - data-testId={"preview-button"} -> this is the button that activates the preview modal
 *      - data-testId={"cancel-preview"} -> this is the button that cancels the preview modal
 *      - data-testId={"publish-button"} -> this is the button that activates the publish modal
 *      - publish-title-input -> this is the title input for the publish form
 *      - publish-dataset-id -> this is the datasetId input for the publish form
 *      - publish-dataset-description -> this is the description for the dataset
 *      - publish-dataset-segment -> this is the segment control for the form
 */

interface IQuantaOverviewProps {
    testing?: boolean
}

const QuantaOverviewView: React.FC<IQuantaOverviewProps> = ({ testing }) => {
    const [previewOpen, setPreviewOpen] = useState(false)
    const closePreview = useCallback(() => setPreviewOpen(false), [])

    const [publishOpen, setPublishOpen] = useState(false)
    const closePublish = useCallback(() => setPublishOpen(false), [])

    const [unpublishOpen, setUnpublishOpen] = useState(false)
    const closeUnpublish = useCallback(() => setUnpublishOpen(false), [])

    const [internalTesting, setInternalTesting] = useState(false)

    useEffect(() => {
        if(testing === undefined)
            return

        setInternalTesting(testing)
    }, [testing])

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
                            data-testId={"preview-button"}
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

            {internalTesting
                ? null
                : <OverviewTabs />
            }
        </div>
    )
}

export default QuantaOverviewView