import { ActionIcon, Button, Group, Stack } from '@mantine/core'
import { IconCode, IconPlus, IconSourceCode } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import { IQuantaSelector } from '../../data/quanta/types/project'
import FileInput from '../../ui/file-input/file-input'
import UIDropdown from '../../ui/ui-dropdown/ui-dropdown'
import SchemaEditor from '../schema-editor/schema-editor'
import styles from './selector-pane.module.scss'

const SelectorPane: React.FC = ({ }) => {
    const quantaContext = useContext(QuantaContextData) as IQuantaState
    const selectors = quantaContext.project_data?.store?.selectors
    const activeSelector = quantaContext.activeSelectorId

    const [selector, setSelector] = useState<IQuantaSelector | null>(null)

    useEffect(() => {
        setSelector(null)
        if(activeSelector === undefined || activeSelector === null)
            return
        if(selectors === undefined)
            return

        let fSelector = null
        for(let i = 0; i < selectors.length; i++) {
            let selector_ = selectors[i]
            if(selector_.selectorId === activeSelector)
                fSelector = selector_
        }

        if(fSelector === null)
            return
        setSelector({ ...fSelector })
    }, [activeSelector])
    
    return (
        <>
            {selector && (
                <div className={styles.pane__wrapper}>
                    <div className={styles.title__section}>
                        <div className={styles.title__row}>
                            <div className={styles.title}>
                                {selector.selectorName}
                            </div>

                            <Group spacing={7.5}>
                                <Button
                                    variant={'outline'}
                                    compact
                                    size={'sm'}
                                    radius={"xl"}
                                    color={"teal"}
                                >
                                    Linked Selector
                                </Button>

                                <Button
                                    variant={'outline'}
                                    compact
                                    size={'sm'}
                                    radius={"xl"}
                                    color={"gray"}
                                >
                                    <IconPlus size={10} stroke={"2"} />
                                    Add
                                </Button>
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
                            <FileInput />
                            <FileInput />
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
                                    <SchemaEditor schemaId={selector.selectorId!} />
                                )}
                            </div>

                            <div className={styles.compare}>
                                <SchemaEditor schemaId={"dataset"} />
                            </div>
                        </div>
                    </div>

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
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SelectorPane