import prebuildNodeDict from "../config/prebuilt_nodes"
import { IQuantaEditorGlobals, IQuantaRFNodeData } from "../types/types"
import styles from './node-renderer.module.scss'
import { useState, useRef, useEffect, useContext } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import OutputRenderer from "./output/OutputRenderer"
import { Divider } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import NodeControl from "./node-control"
import ActionMenu from "../../../lunar/document-editor/blocks/action-menu"
import NodeActionMenu from "./action-menu/action-menu"
import InputRenderer from "./input/input-renderer"
import IterBody from "./iter-body"

interface IQuantaNodeProps {
    data?: IQuantaRFNodeData,
    selected: boolean
}

const QuantaNode: React.FC<IQuantaNodeProps> = ({ data, selected }) => {
    if(data?.instructionId === undefined)
        return null
    const instructions = prebuildNodeDict[data.instructionId]

    const [focused, setFocused] = useState(false)
    const unfocus = () => setFocused(false)
    const ref = useRef<HTMLDivElement>(null)

    const [parentId, setParentId] = useState<string | undefined>(undefined)

    const quantaEditorContext = useContext(QuantaEditorContext) as IQuantaEditorGlobals | null
    
    useEffect(() => {
        setFocused(selected)
    }, [selected])

    useEffect(() => {
        let nodeId = data.nodeId
        if(nodeId === undefined)
            return
        if(quantaEditorContext === null)
            return

        let node = quantaEditorContext.getNode(nodeId)
        let parent = node?.parentNode
        setParentId(parent)
    }, [data])

    useEffect(() => {
        if(quantaEditorContext?.focusToggle === undefined)
            return

        setFocused(false)
    }, [quantaEditorContext?.focusToggle])

    return (
        <div>
            <div
                className={`${styles.node__wrapper} ${focused && styles.active}`}
                ref={ref}
            >
                <div className={styles.node__title}>
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

                    {instructions.inputs?.map((step) => (
                        <InputRenderer
                            input={step}
                            nodeId={data.nodeId}
                            focused={focused}
                            data={data}
                        />
                    ))}

                    {instructions.outputs?.map((step) => (
                        <OutputRenderer
                            output={step}
                            nodeId={data.nodeId}
                            focused={focused}
                            unfocus={unfocus}
                            parentId={parentId}
                        />
                    ))}

                    {instructions.controls?.map((step) => (
                        <NodeControl 
                            control={step}
                            nodeId={data.nodeId}
                        />
                    ))}

                    <NodeActionMenu 
                        instructions={instructions}
                        focused={focused}
                        nodeId={data.nodeId}
                    />
                </div>
            </div>
        </div>
    )
}

export default QuantaNode