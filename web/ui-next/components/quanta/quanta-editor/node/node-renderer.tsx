import { useClickOutside } from "@mantine/hooks"
import { useEffect, useRef, useState } from "react"
import { IQuantaNodeInstructions } from "../types"
import NodeOutput from "./node-output"
import styles from './node-renderer.module.scss'

interface INodeRenderer {
    instructions: IQuantaNodeInstructions
}

const NodeRenderer: React.FC<INodeRenderer> = ({ instructions }) => {
    const [focused, setFocused] = useState(false)
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
        <div
            className={`${styles.node__wrapper} ${focused && styles.active}`}
            onClick={() => setFocused(true)}
            onDragExitCapture={() => console.log("slatt")}
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
                    />
                ))}
            </div>
        </div>
    )
}

export default NodeRenderer