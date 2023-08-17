import { ActionIcon, Group, Menu, Text, Tooltip } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Motion, spring } from 'react-motion'
import { Handle, Position } from 'reactflow'
import { IQuantaSocket, IQuantaTypeRef, IQuantaXYPos } from '../../types/types'
import NodeCreateMenu from '../node-create-menu'
import styles from '../node-renderer.module.scss'
import NodeType from '../type/node-type'
import NodeTypeSelector from '../type/node-type-selector'
import NodeOutputView from './output-view'

interface INodeOutputProps {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    unfocus: () => void,
    editType?: (itemId: string, newType: IQuantaTypeRef) => void,
    deleteStoreField?: (itemId: string) => void,
    parentId?: string,
    index: number
}

const NodeOutput: React.FC<INodeOutputProps> = ({ 
    output, 
    nodeId, 
    focused, 
    unfocus, 
    editType, 
    deleteStoreField, 
    parentId,
    index 
}) => {
    const ref = useRef<HTMLDivElement>(null)

    const [opened, setOpened] = useState(false)
    const [handleCords, setHandleCords] = useState<IQuantaXYPos | undefined>(undefined)

    useEffect(() => {
        if(focused === true) {
            if(ref.current === null)
                return

            let _handleCoords = ref.current.getBoundingClientRect()
            setHandleCords({ x: _handleCoords.x, y: _handleCoords.y })
        }

        if(focused === false)
            setOpened(false)
    }, [focused])

    const deleteField = useCallback(() => {
        if(output.dynamicSocketTag !== true)
            return
        if(output.socketId === undefined)
            return
        if(deleteStoreField === undefined)
            return

        deleteStoreField(output.socketId)
    }, [output, deleteStoreField])

    return (
        <div ref={ref} data-testId={`output-${index}`}>
            <NodeOutputView
                output={output}
                focused={focused}
                handleCords={handleCords}
                nodeId={nodeId}
                ref={ref}
                parentId={parentId}
                editType={editType}
                unfocus={unfocus}
                index={index}
                deleteField={deleteField}
            />
        </div>
    )
}

export default NodeOutput