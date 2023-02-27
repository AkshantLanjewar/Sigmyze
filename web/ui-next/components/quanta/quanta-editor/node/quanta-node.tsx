import prebuildNodeDict from "../prebuilt_nodes"
import { IQuantaRFNodeData } from "../types"
import styles from './node-renderer.module.scss'
import { useState, useRef, useEffect } from "react"
import NodeOutput from "./node-output"

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

                    {instructions.outputs?.map((step) => (
                        <NodeOutput
                            output={step}
                            focused={focused}
                            unfocus={unfocus}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuantaNode