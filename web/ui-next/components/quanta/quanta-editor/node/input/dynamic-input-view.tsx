import { memo } from "react";
import { IQuantaSocket } from "../../types/node-instructions";
import { IQuantaRFNodeData } from "../../types/nodes"
import styles from '../node-renderer.module.scss'
import InputRenderer from "./input-renderer";

interface IViewProps {
    childSockets: IQuantaSocket[],
    nodeId: string | undefined,
    focused: boolean | undefined,
    input: IQuantaSocket,
    data: IQuantaRFNodeData | undefined
}

const DynamicInputView: React.FC<IViewProps> = memo(({
    childSockets,
    nodeId,
    focused,
    input,
    data
}) => {
    return (
        <div className={styles.dynamic__node}>
            <div className={styles.title} data-testId={"input-group-title"}>{input.groupTitle}</div>

            <div className={styles.dynamic__items} data-testId={"input-group-children"}>
                {childSockets.map((step, i) => (
                    <InputRenderer
                        input={step}
                        nodeId={nodeId}
                        focused={focused}
                        data={data}
                        index={i}
                        isChild={true}
                    />
                ))}
            </div>
        </div>
    )
})

export default DynamicInputView