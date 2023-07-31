import prebuildNodeDict from "../config/prebuilt_nodes"
import { IQuantaEditorGlobals, IQuantaRFNodeData } from "../types/types"
import { useState, useRef, useEffect, useContext, useCallback, useMemo } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import { ExecutionContextData } from "../execution-engine/context"
import { IExecutionEngineContext } from "../execution-engine/context/types"
import QuantaNodeView from "./quanta-node-view"

interface IQuantaNodeProps {
    data?: IQuantaRFNodeData,
    selected: boolean
}

const QuantaNode: React.FC<IQuantaNodeProps> = ({ data, selected }) => {
    if(data?.instructionId === undefined)
        return null

    const instructions = useMemo(() => prebuildNodeDict[data.instructionId!], [data])
    const [executing, setExecuting] = useState(false)
    const [focused, setFocused] = useState(false)
    const unfocus = useCallback(() => setFocused(false), [])
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
        <QuantaNodeView
            focused={focused}
            ref={ref}
            executing={executing}
            instructions={instructions}
            data={data}
            selected={selected}
            parentId={parentId}
            unfocus={unfocus}
        />
    )
}

export default QuantaNode