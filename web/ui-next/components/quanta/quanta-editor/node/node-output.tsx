import { ActionIcon, Group, Menu, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import { Motion, spring } from 'react-motion'
import { Handle, Position } from 'reactflow'
import { IQuantaSocket } from '../types'
import NodeCreateMenu from './node-create-menu'
import styles from './node-renderer.module.scss'

interface INodeOutputProps {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    unfocus: () => void
}

const NodeOutput: React.FC<INodeOutputProps> = ({ output, nodeId, focused, unfocus }) => {
    const ref = useRef<HTMLElement>(null)
    const [opened, setOpened] = useState(false)

    useEffect(() => {
        if(focused === false)
            setOpened(false)
    }, [focused])

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
                    {output.socketName}
                </Text>

                {output.icon}
            </Group>

            <Handle 
                type='source' 
                position={Position.Right}
                className={styles.output}
                id={output.socketId}
            />

            <Motion style={{ x: spring(focused ? -75 : 0) }} >
                {({ x }) => (
                    <div className={styles.node__add} style={{ right: x }}>       
                        <NodeCreateMenu 
                            focused={focused} 
                            output={output}
                            unfocus={unfocus}
                            nodeId={nodeId}
                            handleRef={ref}
                        />
                    </div>
                )}
            </Motion>
        </div>
    )
}

export default NodeOutput