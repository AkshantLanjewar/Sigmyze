import { Group, Text } from "@mantine/core"
import { Handle, Position } from "reactflow"
import { IQuantaSocket } from "../types"
import styles from './node-renderer.module.scss'

interface INodeInputProps {
    socket: IQuantaSocket
}

const NodeInput: React.FC<INodeInputProps> = ({ socket }) => {
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

            <Handle 
                type='source' 
                position={Position.Left}
                className={styles.input}
                id={socket.socketId}
            />
            
            <div>

            </div>
        </div>
    )
}

export default NodeInput