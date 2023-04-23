import prebuildNodeDict from "../config/prebuilt_nodes"
import { IQuantaEditorGlobals, IQuantaRFNodeData } from "../types/types"
import styles from './node-renderer.module.scss'
import { useState, useRef, useEffect, useContext } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import OutputRenderer from "./output/OutputRenderer"
import NodeControl from "./node-control"
import NodeActionMenu from "./action-menu/action-menu"
import InputRenderer from "./input/input-renderer"
import IterBody from "./iter-body"
import { ExecutionContextData } from "../execution-engine/context"
import { IExecutionEngineContext } from "../execution-engine/context/types"
import NodeLoader from "./node-loader"

interface IQuantaNodeProps {
    data?: IQuantaRFNodeData,
    selected: boolean
}

const QuantaNode: React.FC<IQuantaNodeProps> = ({ data, selected }) => {
    if(data?.instructionId === undefined)
        return null
    const instructions = prebuildNodeDict[data.instructionId]

    const [executing, setExecuting] = useState(false)
    const [focused, setFocused] = useState(false)
    const unfocus = () => setFocused(false)
    const ref = useRef<HTMLDivElement>(null)

    const [parentId, setParentId] = useState<string | undefined>(undefined)

    const quantaEditorContext = useContext(QuantaEditorContext) as IQuantaEditorGlobals | null
    const { activeNode } = useContext(ExecutionContextData) as IExecutionEngineContext
    
    useEffect(() => {
        setExecuting(false)
        if(activeNode === data.nodeId)
            setExecuting(true)
    }, [activeNode])

    useEffect(() => {
        setFocused(selected)

        if(quantaEditorContext?.viewOnly === true)
            setFocused(false)
    }, [selected])

    useEffect(() => {
        let nodeId = data.nodeId
        if(nodeId === undefined)
            return
        if(quantaEditorContext === null)
            return

        let node = quantaEditorContext.getNode(nodeId)
        let parent = node?.parentNode
        
        if(parent !== undefined)
            setParentId(parent)
    }, [data])

    useEffect(() => {
        if(quantaEditorContext?.focusToggle === undefined)
            return

        setFocused(false)
    }, [quantaEditorContext?.focusToggle])

    useEffect(() => {
        if(quantaEditorContext === null)
            return
        if(instructions.cacheable === true)
            quantaEditorContext.hasCache()
    }, [instructions])

    return (
        <div>
            <div
                className={`${styles.node__wrapper} ${focused && styles.active}`}
                ref={ref}
            >
                <NodeLoader executing={executing} />

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