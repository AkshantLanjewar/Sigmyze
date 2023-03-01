import { ActionIcon, Group, Menu, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import { Motion, spring } from 'react-motion'
import { Handle, Position } from 'reactflow'
import { IQuantaSocket, IQuantaTypeRef } from '../../types'
import NodeCreateMenu from '../node-create-menu'
import styles from '../node-renderer.module.scss'
import NodeType from '../type/node-type'
import NodeTypeSelector from '../type/node-type-selector'

interface INodeOutputProps {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    unfocus: () => void,
    editType?: (itemId: string, newType: IQuantaTypeRef) => void
}

const NodeOutput: React.FC<INodeOutputProps> = ({ output, nodeId, focused, unfocus, editType }) => {
    const ref = useRef<HTMLElement>(null)
    const [opened, setOpened] = useState(false)

    useEffect(() => {
        if(focused === false)
            setOpened(false)
    }, [focused])

    return (
        <div className={styles.node__socket}>
            {output.hideType
                ? <div />
                : (
                    <>
                        {output.selectableType
                            ? (
                                <NodeTypeSelector 
                                    output={output} 
                                    focused={focused}
                                    socketId={output.socketId}
                                    editType={editType}
                                />
                            )
                            : <NodeType type={output.type}/>
                        }
                    </>
                )
            }

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

            <Motion style={{ x: spring(focused ? -75 : 0), opacity: spring(focused ? 1 : 0) }} >
                {({ x, opacity }) => (
                    <div className={styles.node__add} style={{ right: x, opacity: opacity }}>       
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