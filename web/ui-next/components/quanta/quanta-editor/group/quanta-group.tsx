import { useEffect, useState } from 'react'
import { IQuantaRFNodeData, IQuantaRFNodeStyles, IQuantaXYPos } from '../types/types'
import styles from './quanta-group.module.scss'

import { NodeResizer } from '@reactflow/node-resizer'
import '@reactflow/node-resizer/dist/style.css'
import { Handle, Position } from 'reactflow'
import NodeActionMenu from '../node/action-menu/action-menu'

interface IQuantaGroupProps {
    selected: boolean,
    id: string
}

const QuantaGroup: React.FC<IQuantaGroupProps> = ({ selected, id }) => {
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
                type={"source"}
                position={Position.Left}
                className={`${styles.input} ${styles.left}`}
            />

            <Handle
                type={"target"}
                position={Position.Right}
                className={`${styles.input} ${styles.right}`}
            />

            <div className={styles.quanta__group}>
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