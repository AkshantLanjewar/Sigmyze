import { ActionIcon, Group, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import { useEffect, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { IQuantaNodeOutput } from '../types'
import styles from './node-renderer.module.scss'

interface INodeOutputProps {
    output: IQuantaNodeOutput,
    focused: boolean
}

const NodeOutput: React.FC<INodeOutputProps> = ({ output, focused }) => {
    const ref = useRef<HTMLDivElement>(null)
    

    return (
        <div className={styles.node__socket}>
            <div>

            </div>

            <Group 
                align={"center"} 
                spacing={'xs'}
                className={styles.priority}
            >
                <Text
                    color={"dimmed"}
                    size={'sm'}
                >
                    {output.outputName}
                </Text>

                {output.icon}
            </Group>

            <Handle 
                type='source' 
                position={Position.Right}
                className={styles.output}
                ref={ref}
            />

            <div className={styles.node__add} style={{ opacity: focused ? 1 : 0 }}>
                <div className={styles.stem}></div>

                <ActionIcon
                    color={"dark"}
                    variant={"filled"}
                    radius={"md"}
                    className={styles.add__button}
                >
                    <IconPlus size={14} stroke={"2"} />
                </ActionIcon>
            </div>
        </div>
    )
}

export default NodeOutput