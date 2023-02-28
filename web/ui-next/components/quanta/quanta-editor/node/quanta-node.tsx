import prebuildNodeDict from "../prebuilt_nodes"
import { IQuantaEditorGlobals, IQuantaRFNodeData } from "../types"
import styles from './node-renderer.module.scss'
import { useState, useRef, useEffect, useContext } from "react"
import { QuantaEditorContext } from "../quanta-editor"
import NodeInput from "./node-input"
import OutputRenderer from "./output/OutputRenderer"
import { Divider } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import NodeControl from "./node-control"

interface IQuantaNodeProps {
    data?: IQuantaRFNodeData
}

const QuantaNode: React.FC<IQuantaNodeProps> = ({ data }) => {
    if(data?.instructionId === undefined)
        return null
    const instructions = prebuildNodeDict[data.instructionId]

    const [focused, setFocused] = useState(false)
    const unfocus = () => setFocused(false)
    const ref = useRef<HTMLDivElement>(null)

    const quantaEditorContext = useContext(QuantaEditorContext) as IQuantaEditorGlobals | null
    
    useEffect(() => {
        function clickListener(e: any) {
            if(ref.current === null)
                return
            if(ref.current.contains(e.target))
                return

            setFocused(false)
        }

        if(focused === false)
            document.removeEventListener("click", clickListener)
        else
            document.addEventListener("click", clickListener)
    }, [focused])

    useEffect(() => {
        if(quantaEditorContext?.focusToggle === undefined)
            return

        setFocused(false)
    }, [quantaEditorContext?.focusToggle])

    let showDivider = true
    if(instructions.outputs === undefined || instructions.inputs === undefined)
        showDivider = false
    if(showDivider && (instructions.outputs!.length === 0 || instructions.inputs!.length === 0))
        showDivider = false

    return (
        <div>
            <div
                className={`${styles.node__wrapper} ${focused && styles.active}`}
                onClick={() => setFocused(true)}
                ref={ref}
            >
                <div className={styles.node__title}>
                    {instructions.icon}

                    <div className={styles.title}>
                        {instructions.name}
                    </div>
                </div>

                <div className={styles.node__body}>
                    {instructions.inputs?.map((step) => (
                        <NodeInput
                            socket={step}
                        />
                    ))}

                    {showDivider && (
                        <Divider
                            size={"sm"}
                            color={"#bbb"}
                            label={<IconPlus size={18} stroke={"2"} color={"#bbb"} />}
                            labelPosition={"center"}
                        />
                    )}

                    {instructions.outputs?.map((step) => (
                        <OutputRenderer
                            output={step}
                            nodeId={data.nodeId}
                            focused={focused}
                            unfocus={unfocus}
                        />
                    ))}

                    {instructions.controls?.map((step) => (
                        <NodeControl 
                            control={step}
                            nodeId={data.nodeId}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuantaNode