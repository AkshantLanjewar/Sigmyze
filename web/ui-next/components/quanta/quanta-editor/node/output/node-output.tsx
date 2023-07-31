import { ActionIcon, Group, Menu, Text, Tooltip } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Motion, spring } from 'react-motion'
import { Handle, Position } from 'reactflow'
import { IQuantaSocket, IQuantaTypeRef } from '../../types/types'
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
    parentId?: string
}

const NodeOutput: React.FC<INodeOutputProps> = ({ output, nodeId, focused, unfocus, editType, deleteStoreField, parentId }) => {
    const ref = useRef<HTMLElement>(null)
    const [opened, setOpened] = useState(false)

    useEffect(() => {
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
        <NodeOutputView
            output={output}
            focused={focused}
            nodeId={nodeId}
            ref={ref}
            parentId={parentId}
            editType={editType}
            unfocus={unfocus}
            deleteField={deleteField}
        />
    )
}

export default NodeOutput