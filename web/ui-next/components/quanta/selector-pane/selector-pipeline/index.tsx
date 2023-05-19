import { Button, Group, Menu } from '@mantine/core'
import styles from '../selector-pane.module.scss'
import mod_styles from './selector-pipeline.module.scss'
import { IconApps, IconChartBar, IconSelect } from '@tabler/icons'
import { useContext, useEffect, useState } from 'react'
import { SelectorPaneContextData } from '../context'
import { ISelectorPaneState } from '../context/types'
import { QuantaContextData } from '../../../data/quanta/context'
import { IQuantaState } from '../../../data/quanta/types'
import { v4 } from 'uuid'
import { NodeCreateMenuInner } from '../../quanta-editor/node/node-create-menu'
import PipelineObject from './pipeline-object'

interface ISelectorPipelineOptions {
    displayType: 'dataset' | 'selected',
    optionName: string,
    linkedItemId?: string
}

const SelectorPipeline: React.FC = ({ }) => {
    const [options, setOptions] = useState<ISelectorPipelineOptions[]>([])

    const { getSchema } = useContext(QuantaContextData) as IQuantaState
    const { pipelinedObjects, addPipelineObject } = useContext(SelectorPaneContextData) as ISelectorPaneState
    
    function pipelinedHasSelected() {
        for(let i = 0; i < pipelinedObjects.length; i++) {
            let pipelinedObject = pipelinedObjects[i]
            if(pipelinedObject.pipeline_type === "selected")
                return true
        }
        
        return false
    }

    function pipelienHasSchema(itemId: string) {
        let schema = getSchema('dataset')?.children
        if(schema === undefined)
            return false

        for(let i = 0; i < pipelinedObjects.length; i++) {
            let schemaChild = pipelinedObjects[i]
            if(schemaChild.dataset_id === itemId)
                return true
        }
        
        return false
    }

    function loadPipelineOptions() {
        let nOptions = [] as ISelectorPipelineOptions[]
        let schema = getSchema('dataset')?.children
        if(schema === undefined)
            return

        for(let i = 0; i < schema.length; i++) {
            let schemaChild = schema[i]
            let optionObject = {} as ISelectorPipelineOptions

            if(schemaChild.name === undefined || schemaChild.nodeId === undefined)
                continue
            if(pipelienHasSchema(schemaChild.nodeId))
                continue

            optionObject.displayType = 'dataset'
            optionObject.optionName = schemaChild.name
            optionObject.linkedItemId = schemaChild.nodeId
            nOptions.push(optionObject)
        }

        setOptions([ ...nOptions ])
    }

    useEffect(() => {
        loadPipelineOptions()
    }, [])

    useEffect(() => {
        loadPipelineOptions()
    }, [pipelinedObjects])
    
    return (
        <div className={styles.section}>
            <div className={mod_styles.title__wrapper}>
                <div className={styles.title__section}>
                    <div className={styles.title__row}>
                        <div className={styles.title}>Pipeline Data</div>
                    </div>

                    <div className={styles.title__description}>
                        Pipeline data into the selector, whether it is the current selected object, 
                        or data collected from the dataset
                    </div>
                </div>

                <Menu
                    shadow='md'
                    width={200}
                    withArrow
                    position={'bottom-end'}
                >
                    <Menu.Target>
                        <Button>
                            <Group align='center' spacing={2.5}>
                                <IconApps size={18} fill='white' />
                                Add
                            </Group>
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {options.map((step) => {
                            let menuIcon = <IconSelect stroke={"2"} />
                            if(step.displayType == "dataset")
                                menuIcon = <IconChartBar stroke={"2"} />

                            let menuDescription = "Values selected by previous selectors"
                            if(step.displayType == "dataset")
                                menuDescription = "Values collected by the dataset"

                            const onCLick = () => {
                                if(step.displayType === "dataset" && step.linkedItemId === undefined)
                                    return

                                addPipelineObject(step)
                            }

                            return (
                                <NodeCreateMenuInner 
                                    key={v4()} 
                                    name={step.optionName}
                                    description={menuDescription}
                                    onClick={onCLick}
                                    icon={menuIcon}
                                />
                            )
                        })}
                    </Menu.Dropdown>
                </Menu>
            </div>

            <div className={mod_styles.pipeline__objects}>
                {pipelinedObjects.map((step) => (
                    <PipelineObject
                        key={step.pipeline_id} 
                        step={step} 
                    />
                ))}
            </div>
        </div>
    )
}

export type { ISelectorPipelineOptions }
export default SelectorPipeline