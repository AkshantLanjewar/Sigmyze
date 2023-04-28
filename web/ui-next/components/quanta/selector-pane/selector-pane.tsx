import { ActionIcon, Button, Group, Tooltip } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { IQuantaSelector, ISelectorPipeline } from '../../data/quanta/types/project'
import SchemaEditor from '../schema-editor/schema-editor'
import styles from './selector-pane.module.scss'
import SelectorCodeUpload from '../selector-code-upload'
import SocketHandler from '../../ui/socket-handler'
import SelectorPaneContext from './context'
import FramePreview from './frame-preview'
import SelectorPipeline from './selector-pipeline'
import { useEffectDebugger } from '../../ui/debug'
import SelectorForms from './selector-forms'

const SelectorPane: React.FC = ({ }) => {
    const { selectors, activeSelectorId, dataLoaded } = useContext(QuantaContextData) as IQuantaState
    const [selector, setSelector] = useState<IQuantaSelector | null>(null)

    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)

    useEffectDebugger(() => {
        setSelector(null)
        if(activeSelectorId === undefined || activeSelectorId === null)
            return
        if(selectors === undefined)
            return
        if(dataLoaded !== true)
            return

        let fSelector = null
        let nPipeline = {} as ISelectorPipeline
        for(let i = 0; i < selectors.length; i++) {
            let selector_ = selectors[i]
            if(selector_.selectorId !== activeSelectorId)
                continue

            let analysis = selector_.selectorPipeline?.pipelineAnalysis
            if(analysis !== undefined)
                nPipeline.pipelineAnalysis = [ ...analysis ]

            let objects = selector_.selectorPipeline?.pipelinedObjects
            if(objects !== undefined)
                nPipeline.pipelinedObjects = [ ...objects ]

            fSelector = { ...selector_ }
        }

        if(fSelector === null)
            return

        fSelector.selectorPipeline = nPipeline
        setSelector({ ...fSelector })
    }, [activeSelectorId])
    
    return (
        <>
            <SelectorForms
                modalState={modalState}
                closeModal={closeModal}
                selectorId={activeSelectorId}
            />

            {selector && (
                <SelectorPaneContext 
                    selectorId={selector.selectorId!}
                    extSelectorCode={selector.selectorCode}
                    extSelectorPipeline={selector.selectorPipeline}
                >
                    <div className={styles.pane__wrapper}>
                        <div className={styles.title__section}>
                            <div className={styles.title__row}>
                                <div className={styles.title}>
                                    {selector.selectorName}
                                </div>

                                <Group spacing={0}>
                                    <Tooltip
                                        label={"Delete Selector"}
                                        transition={"slide-down"}
                                        position={"bottom"}
                                        styles={{ tooltip: { backgroundColor: "#08090A" } }}
                                        withArrow
                                    >
                                        <ActionIcon
                                            color={"red"}
                                            variant={"filled"}
                                            onClick={() => setModalState("delete_selector")}
                                        >
                                            <IconTrash size={"1.125rem"} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </div>

                            <div className={styles.description}>
                                {selector.selectorDescription}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.title__section}>
                                <div className={styles.title__row}>
                                    <div className={styles.title}>Selector Code</div>
                                </div>

                                <div className={styles.title__description}>
                                    This is the code for your selector. Either select a prebuilt selector made by us, 
                                    or select the type of code you would like to construct your selector with. 
                                    List of currently supported languages here
                                </div>
                            </div>

                            <div className={styles.file__upload}>
                                <SelectorCodeUpload />
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.title__section}>
                                <div className={styles.title__row}>
                                    <div className={styles.title}>Selector Schema</div>
                                </div>

                                <div className={styles.title__description}>
                                    This is the schema for your selector. Define the object that will be returned by your code, 
                                    and link that object to the schema for the dataset.
                                </div>
                            </div>

                            <div className={styles.schema__compare}>
                                <div className={styles.compare}>
                                    {selector && (
                                        <SchemaEditor 
                                            schemaId={selector.selectorId!} 
                                            viewOnly={true} 
                                            linkedSchema='dataset'
                                        />
                                    )}
                                </div>

                                <div className={styles.compare}>
                                    <SchemaEditor schemaId={"dataset"} viewOnly={true} />
                                </div>
                            </div>
                        </div>

                        <SelectorPipeline />

                        <div className={styles.section}>
                            <div className={styles.title__section}>
                                <div className={styles.title__row}>
                                    <div className={styles.title}>Selector Preview</div>
                                </div>

                                <div className={styles.title__description}>
                                    This is a little preview of your selector
                                </div>
                            </div>

                            <div className={styles.preview}>
                                <FramePreview />
                            </div>
                        </div>
                    </div>
                </SelectorPaneContext>
            )}
        </>
    )
}

export default SelectorPane