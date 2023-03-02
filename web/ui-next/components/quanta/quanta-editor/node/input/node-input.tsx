import { Group, Text } from "@mantine/core"
import { Handle, Position } from "reactflow"
import { IQuantaSocket, IQuantaTypeRef } from "../../types/types"
import styles from '../node-renderer.module.scss'
import NodeType from "../type/node-type"
import NodeTypeSelector from "../type/node-type-selector"

interface INodeInputProps {
    socket: IQuantaSocket,
    focused?: boolean,
    localType?: IQuantaTypeRef,
    editType?: (socketId: string, newType: IQuantaTypeRef) => void
}

const NodeInput: React.FC<INodeInputProps> = ({ socket, focused, editType }) => {
    return (
        <div className={styles.node__socket}>
            <Group
                align={"center"} 
                spacing={'xs'}
                className={styles.priority}
            >
                {socket.icon}

                <Text
                    color={"dimmed"}
                    size={'sm'}
                >
                    {socket.socketName}
                </Text>
            </Group>

            {socket.staticSocket
                ? null
                : (
                    <Handle 
                        type='source' 
                        position={Position.Left}
                        className={styles.input}
                        id={socket.socketId}
                    />
                )
            }
            
            {socket.hideType === true
                ? <div />
                : (
                    <>
                        {socket.selectableType
                            ? (
                                <NodeTypeSelector
                                    output={socket}
                                    focused={focused}
                                    socketId={socket.socketId}
                                    editType={editType}
                                />
                            )
                            : <NodeType type={socket.type} />
                        }
                    </>
                )
            }
        </div>
    )
}

export default NodeInput