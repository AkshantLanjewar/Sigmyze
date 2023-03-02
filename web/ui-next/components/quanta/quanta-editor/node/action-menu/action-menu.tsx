import { ActionIcon, Tooltip } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useContext } from "react"
import { Motion, spring } from "react-motion"
import { QuantaEditorContext } from "../../quanta-editor"
import { IQuantaNodeInstructions } from "../../types/types"
import styles from './action-menu.module.scss'

interface INodeActionMenuProps {
    instructions?: IQuantaNodeInstructions,
    focused: boolean,
    nodeId?: string,
    backend?: string
}

const NodeActionMenu: React.FC<INodeActionMenuProps> = ({ instructions, focused, nodeId, backend }) => {
    const quantaEditorContext = useContext(QuantaEditorContext)

    function deleteNode() {
        if(quantaEditorContext === null)
            return
        if(nodeId === undefined)
            return

        quantaEditorContext.deleteNode(nodeId, backend)
    }

    return (
        <div className={styles.action__wrapper}>
            {instructions?.immutableNode
                ? null
                : (
                    <div className={styles.action}>
                        <Motion style={{ x: spring(focused ? -75 : 0), opacity: spring(focused ? 1 : 0) }}>
                            {({ x, opacity }) => (    
                                <div style={{ position: 'absolute', bottom: x, opacity: opacity }}>
                                    <div>
                                        <Tooltip
                                            withArrow
                                            color={"dark"}
                                            label={backend === "group" ? "Delete Group" : "Delete Node"}
                                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                                            openDelay={250}
                                            transition={"slide-down"}
                                            position={"bottom"}
                                        >
                                            <ActionIcon
                                                color={"red"}
                                                variant={"filled"}
                                                radius={"sm"}
                                                onClick={deleteNode}
                                            >
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}
                        </Motion>
                    </div>
                )
            }
        </div>
    )
}

export default NodeActionMenu