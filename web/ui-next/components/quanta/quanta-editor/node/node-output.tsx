import { ActionIcon, Group, Menu, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import { Motion, spring } from 'react-motion'
import { Handle, Position } from 'reactflow'
import { IQuantaSocket } from '../types'
import styles from './node-renderer.module.scss'

interface INodeOutputProps {
    output: IQuantaSocket,
    focused: boolean
}

const NodeOutput: React.FC<INodeOutputProps> = ({ output, focused }) => {
    const ref = useRef<HTMLDivElement>(null)
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
                ref={ref}
            />

            <Motion style={{ x: spring(focused ? -75 : 0) }} >
                {({ x }) => (
                    <div className={styles.node__add} style={{ right: x }}>
                        <div className={styles.stem}></div>
        
                        <Menu
                            width={150}
                            position={'right-start'}
                            withArrow
                            opened={opened}
                            onClose={() => setOpened(false)}
                        >
                            <Menu.Target>
                                <ActionIcon
                                    color={"dark"}
                                    variant={"filled"}
                                    radius={"md"}
                                    className={styles.add__button}
                                    onClick={() => setOpened(true)}
                                >
                                    <IconPlus size={14} stroke={"2"} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>

                            </Menu.Dropdown>
                        </Menu>
                    </div>
                )}
            </Motion>
        </div>
    )
}

export default NodeOutput