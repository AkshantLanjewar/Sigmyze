import { Badge, CloseButton, Group } from '@mantine/core'
import schema_styles from '../../schema-editor/schema-viewer.module.scss'
import { IPipelinedData, ISelectorPaneState } from '../context/types'
import { useContext } from 'react'
import { SelectorPaneContextData } from '../context'

interface IPipelinedObjectProps {
    step: IPipelinedData
}

const PipelineObject: React.FC<IPipelinedObjectProps> = ({ step }) => {
    const { deletePipelineObject } = useContext(SelectorPaneContextData) as ISelectorPaneState
    
    const onClick = () => {
        deletePipelineObject(step.pipeline_id)
    }

    return (
        <div className={schema_styles.schema__node}>
            <div className={schema_styles.name}>
                <div className={schema_styles.text}>{step.pipeline_name}</div>
            </div>

            <Group spacing={8} className={schema_styles.flare}>
                <Badge
                    variant={"filled"}
                    color={"grape"}
                    size={"lg"}
                    sx={{ textTransform: "uppercase" }}
                >
                    {step.pipeline_type}
                </Badge>

                <CloseButton
                    title='Remove Pipeline'
                    size={"md"}
                    onClick={onClick}
                />
            </Group>
        </div>
    )
}

export default PipelineObject