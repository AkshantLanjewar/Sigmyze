import { IQuantaXYPos } from '../../../../../../quanta/quanta-editor/types/nodes'
import { Resizable } from "re-resizable"
import styles from './index.module.scss'

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
    /**
     * The initial load dims
     */
    dims: IQuantaXYPos,

    /**
     * Whether or not to maintain the inital aspect ratio
     */
    maintainAspectRatio: boolean,

    /**
     * Whether or not the component is currently hovered
     */
    hovered: boolean,

    /**
     * The children that are being wrapped
     */
    children: React.ReactNode,

    /**
     * This is the function that changes the dims
     */
    setDims: (dims: IQuantaXYPos) => void
}

const ResizeableWrapper: React.FC<IResizeableWrapperProps> = ({ dims, maintainAspectRatio, hovered, children, setDims }) => {
    const resizeStop = (e: any, direction: any, ref: any, d: any) => {
        setDims({ x: dims.x + d.width, y: dims.y + d.height })
    }
    
    return (
        <Resizable
            maxWidth={700}
            className={styles.resizeable__wrapper}
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
    )
}

export default ResizeableWrapper