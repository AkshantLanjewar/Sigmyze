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

/**
 * the focus on the tests surrounding the quanta group will be more related to whether it adapts based on the 
 * props given to the view. IN this case, that means there will be no e2e tests surrounding the group.
 * 
 * UnitTests:
 *      View Mount (not focused)
 *          check if node group is visible
 *      View Mount (focused)
 *          check if delete-icon is visible
 *      View Mount (executing)
 *          check if loader has executing css style opacity 1
 * Locators:
 *      1) node-group -> this is the container for the node group
 *      2) node-loader -> this is the container for the node-loader component
 *      3) delete-icon -> this is the delete-node icon on the action menu
 */

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