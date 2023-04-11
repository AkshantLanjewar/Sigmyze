import { useContext, useEffect, useState } from 'react'
import { IQuantaRFNodeData, IQuantaRFNodeStyles, IQuantaXYPos } from '../types/types'
import styles from './quanta-group.module.scss'

import { NodeResizer } from '@reactflow/node-resizer'
import '@reactflow/node-resizer/dist/style.css'
import { Handle, Position } from 'reactflow'
import NodeActionMenu from '../node/action-menu/action-menu'
import { ExecutionContextData } from '../execution-engine/context'
import { IExecutionEngineContext } from '../execution-engine/context/types'
import NodeLoader from '../node/node-loader'

interface IQuantaGroupProps {
    selected: boolean,
    id: string
}

const QuantaGroup: React.FC<IQuantaGroupProps> = ({ selected, id }) => {
    const [executing, setExecuting] = useState(false)
    const { activeNode } = useContext(ExecutionContextData) as IExecutionEngineContext

    useEffect(() => {
        setExecuting(false)
        if(activeNode === id)
            setExecuting(true)
    }, [activeNode])
    
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

            <div className={styles.quanta__group}>
            <NodeLoader executing={executing} />

                <div className={styles.inner}>
                    <NodeActionMenu 
                        focused={selected} 
                        backend={"group"}
                        nodeId={id}
                    />
                </div>
            </div>
        </>
    )
}

export default QuantaGroup