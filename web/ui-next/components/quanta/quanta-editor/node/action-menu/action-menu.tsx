import { ActionIcon, Tooltip } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useCallback, useContext } from "react"
import { Motion, spring } from "react-motion"
import { QuantaEditorContext } from "../../quanta-editor"
import { IQuantaNodeInstructions } from "../../types/types"
import styles from './action-menu.module.scss'
import NodeActionMenuView from "./action-menu-view"

interface INodeActionMenuProps {
    instructions?: IQuantaNodeInstructions,
    focused: boolean,
    nodeId?: string,
    backend?: string
}

const NodeActionMenu: React.FC<INodeActionMenuProps> = ({ instructions, focused, nodeId, backend }) => {
    const quantaEditorContext = useContext(QuantaEditorContext)

    const deleteNode = useCallback(() => {
        if(quantaEditorContext === null)
            return
        if(nodeId === undefined)
            return

        quantaEditorContext.deleteNode(nodeId, backend)
    }, [quantaEditorContext, nodeId, backend])

    return (
        <NodeActionMenuView
            instructions={instructions}
            backend={backend}
            focused={focused}
            deleteNode={deleteNode}
        />
    )
}

export default NodeActionMenu