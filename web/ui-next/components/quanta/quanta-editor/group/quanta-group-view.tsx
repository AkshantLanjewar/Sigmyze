import { memo } from "react"
import styles from './quanta-group.module.scss'
import { NodeResizer } from "@reactflow/node-resizer"
import { Handle, Position } from "reactflow"
import NodeLoader from "../node/node-loader"
import NodeActionMenu from "../node/action-menu/action-menu"
import { UnstyledButton } from "@mantine/core"

interface IViewProps {
    selected: boolean,
    id: string,
    executing: boolean,
}

const QuantaGroupView: React.FC<IViewProps> = memo(({
    selected,
    id,
    executing
}) => {
    return (
        <>
            <NodeResizer
                color={"#bbb"}
                isVisible={selected}
                nodeId={id}
                lineStyle={{
                    borderRadius: 8
                }}
            />

            <Handle
                type={"target"}
                position={Position.Left}
                className={`${styles.input} ${styles.left}`}
                id={id}
            />

            <Handle
                type={"source"}
                position={Position.Right}
                className={`${styles.input} ${styles.right}`}
                id={id}
            />

            <UnstyledButton className={styles.quanta__group} data-testId={"node-group"}>
                <NodeLoader executing={executing} />

                <div className={styles.inner}>
                    <NodeActionMenu 
                        focused={selected} 
                        backend={"group"}
                        nodeId={id}
                    />
                </div>
            </UnstyledButton>
        </>
    )
})

export default QuantaGroupView