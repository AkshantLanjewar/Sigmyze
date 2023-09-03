import { RefObject, memo } from "react"
import styles from './node-renderer.module.scss'
import { IQuantaNodeInstructions } from "../types/node-instructions"
import NodeLoader from "./node-loader"
import { IQuantaRFNodeData } from "../types/nodes"
import IterBody from "./iter-body"
import InputRenderer from "./input/input-renderer"
import OutputRenderer from "./output/OutputRenderer"
import NodeControl from "./node-control"
import NodeActionMenu from "./action-menu/action-menu"
import { v4 } from "uuid"

interface IViewProps {
    focused: boolean,
    ref: RefObject<HTMLDivElement>,
    executing: boolean,
    instructions: IQuantaNodeInstructions,
    data: IQuantaRFNodeData,
    selected: boolean,
    parentId: string | undefined,
    unfocus: () => void
}

const QuantaNodeView: React.FC<IViewProps> = memo(({
    focused,
    ref,
    executing,
    instructions,
    data,
    selected,
    parentId,
    unfocus
}) => {
    return (
        <div>
            <div
                className={`${styles.node__wrapper} ${focused && styles.active}`}
                ref={ref}
            >
                <NodeLoader executing={executing} />

                <div className={styles.node__title} data-testId={"node-title"}>
                    {instructions.icon}

                    <div className={styles.title}>
                        {instructions.name}
                    </div>
                </div>

                <div className={styles.node__body}>
                    {data.instructionId === "iter" && (
                        <IterBody 
                            nodeId={data.nodeId} 
                            types={data.types}
                            data={data}
                            focused={selected}
                        />
                    )}

                    <div className={styles.socket__renderer} data-testId={"inputs"}>
                        {instructions.inputs?.map((step, i) => (
                            <InputRenderer
                                input={step}
                                nodeId={data.nodeId}
                                focused={focused}
                                data={data}
                                index={i}
                            />
                        ))}
                    </div>

                    <div className={styles.socket__renderer} data-testId={"outputs"}>
                        {instructions.outputs?.map((step, i) => (
                            <OutputRenderer
                                output={step}
                                nodeId={data.nodeId}
                                focused={focused}
                                unfocus={unfocus}
                                parentId={parentId}
                                key={step.socketId}
                                index={i}
                            />
                        ))}
                    </div>

                    <div className={styles.socket__renderer} data-testId={"controls"}>
                        {instructions.controls?.map((step, index) => (
                            <NodeControl 
                                control={step}
                                nodeId={data.nodeId}
                                index={index}
                            />
                        ))}
                    </div>

                    <NodeActionMenu 
                        instructions={instructions}
                        focused={focused}
                        nodeId={data.nodeId}
                    />
                </div>
            </div>
        </div>
    )
})

export default QuantaNodeView