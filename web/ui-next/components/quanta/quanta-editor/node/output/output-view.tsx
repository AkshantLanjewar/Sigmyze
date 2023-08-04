import { RefObject, memo } from "react"
import styles from '../node-renderer.module.scss'
import { IQuantaSocket } from "../../types/node-instructions"
import { IQuantaTypeRef } from "../../types/node-type"
import { Motion, spring } from "react-motion"
import NodeCreateMenu from "../node-create-menu"
import { Group, Tooltip, Text, ActionIcon } from "@mantine/core"
import NodeTypeSelector from "../type/node-type-selector"
import NodeType from "../type/node-type"
import { Handle, Position } from "reactflow"
import { IconTrash } from "@tabler/icons"
import { IQuantaXYPos } from "../../types/nodes"

interface IViewProps {
    output: IQuantaSocket,
    focused: boolean,
    handleCords: IQuantaXYPos | undefined,
    nodeId: string | undefined,
    ref: RefObject<HTMLDivElement>,
    parentId: string | undefined
    editType: ((itemId: string, newType: IQuantaTypeRef) => void) | undefined,
    unfocus: () => void,
    deleteField: () => void
}

const NodeOutputView: React.FC<IViewProps> = memo(({
    output,
    focused,
    handleCords,
    nodeId,
    ref,
    parentId,
    editType,
    unfocus,
    deleteField
}) => {
    return (
        <div className={styles.node__socket}>
            {output.hideType
                ? <div />
                : (
                    <>
                        {output.selectableType
                            ? (
                                <NodeTypeSelector 
                                    output={output} 
                                    focused={focused}
                                    socketId={output.socketId}
                                    editType={editType}
                                />
                            )
                            : (
                                <NodeType 
                                    type={output.type}
                                    isArray={output.isArray}
                                    arrayType={output.arrayType}
                                />
                            )
                        }
                    </>
                )
            }

            <Group 
                align={"center"} 
                spacing={'xs'}
                className={styles.priority}
            >
                <Text
                    color={"dimmed"}
                    size={'sm'}
                >
                    {output.socketName}
                </Text>

                {output.icon}
            </Group>

            <Handle 
                type='source' 
                position={Position.Right}
                className={styles.output}
                id={output.socketId}
            />

            {output.dynamicSocketTag === true && (
                <Motion style={{ x: spring(focused ? -75 : 0), opacity: spring(focused ? 1 : 0) }}>
                    {({ x, opacity }) => (
                        <div className={styles.node__add} style={{ left: x, opacity: opacity }}>       
                            <Tooltip
                                withArrow
                                color={"dark"}
                                label={"Delete Field"}
                                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                                openDelay={250}
                                transition={"slide-down"}
                                position={"left"}
                            >
                                <ActionIcon
                                    color={"red"}
                                    variant={"light"}
                                    radius={"sm"}
                                    onClick={deleteField}
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </div>
                    )}
                </Motion>
            )}

            <Motion style={{ x: spring(focused ? -75 : 0), opacity: spring(focused ? 1 : 0) }} >
                {({ x, opacity }) => (
                    <div className={styles.node__add} style={{ right: x, opacity: opacity }}>       
                        <NodeCreateMenu 
                            focused={focused} 
                            output={output}
                            unfocus={unfocus}
                            handleCords={handleCords}
                            nodeId={nodeId}
                            handleRef={ref}
                            parentId={parentId}
                        />
                    </div>
                )}
            </Motion>
        </div>
    )
})

export default NodeOutputView