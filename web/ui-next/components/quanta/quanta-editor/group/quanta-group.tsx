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
import QuantaGroupView from './quanta-group-view'

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
        <QuantaGroupView
            selected={selected}
            id={id}
            executing={executing}
        />
    )
}

export default QuantaGroup