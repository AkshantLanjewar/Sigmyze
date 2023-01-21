import { ChartDims } from "../../chart-view/engine/types"
import { Resizable } from "re-resizable"
import styles from './resizable-wrapper.module.scss'
import { SetStateAction } from "react"

const Handle = (props: any) => (
    <div {...props}>
        <div className={`
            ${styles.handle} 
            ${props.dir === 'right' && styles.right}
            ${props.dir === 'left' && styles.left}
            ${props.active && styles.active}
        `} />
    </div>
)

interface IResizeableWrapperProps {
    dims: ChartDims,
    setDims: (value: SetStateAction<ChartDims | null>) => void
    maintainAspectRatio: boolean,
    hovered: boolean,
    children: React.ReactNode
}

const ResizableWrapper: React.FC<IResizeableWrapperProps> = ({ dims, setDims, maintainAspectRatio, hovered, children }) => {
    const resizeStop = (e: any, direction: any, ref: any, d: any) => {
        setDims({ x: dims.x + d.width, y: dims.y + d.height })
    }

    return (
        <div>
            <Resizable
                className={styles.resizeableWrapper}
                maxWidth={664}
                lockAspectRatio={maintainAspectRatio}
                size={{ width: dims.x, height: dims.y }}
                enable={{ right: true, left: true }}
                onResizeStop={resizeStop}
                handleComponent={{
                    right: <Handle dir={'right'} active={hovered} />,
                    left: <Handle dir={'left'} active={hovered} />
                }}
            >
                {children}
            </Resizable>
        </div>
    )
}

export default ResizableWrapper