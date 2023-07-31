import { memo } from "react"
import styles from '../node-renderer.module.scss'
import { IQuantaSocket } from "../../types/node-instructions"
import { IQuantaTypeRef } from "../../types/node-type"
import NodeOutput from "./node-output"

interface IViewProps {
    renderedOutputs: IQuantaSocket[],
    output: IQuantaSocket,
    nodeId: string | undefined,
    parentId: string | undefined,
    focused: boolean,
    editType: (itemId: string, newType: IQuantaTypeRef) => void,
    deleteStoreField: (itemId: string) => void
}

const DynamicOutputView: React.FC<IViewProps> = memo(({
    renderedOutputs,
    output,
    nodeId,
    parentId,
    focused,
    editType,
    deleteStoreField
}) => {
    return (
        <div className={styles.dynamic__node}>
            <div className={styles.title}>{output.groupTitle}</div>

            {renderedOutputs.map((step) => (
                <NodeOutput
                    output={step}
                    nodeId={nodeId}
                    parentId={parentId}
                    focused={focused}
                    unfocus={() => { }}
                    editType={editType}
                    deleteStoreField={deleteStoreField}
                />
            ))}
        </div>
    )
})

export default DynamicOutputView