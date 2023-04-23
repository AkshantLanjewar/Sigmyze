import styles from './loader.module.scss'

interface INodeLoaderProps {
    executing: boolean
}

const NodeLoader: React.FC<INodeLoaderProps> = ({ executing }) => {
    return (
        <div className={`${styles.loader__wrapper} ${executing && styles.in__progress}`}>
            <div className={`${styles.bar} ${styles.top}`}></div>
            <div className={`${styles.bar} ${styles.right} ${styles.delay}`}></div>
            <div className={`${styles.bar} ${styles.bottom} ${styles.delay}`}></div>
            <div className={`${styles.bar} ${styles.left}`}></div>
        </div>
    )
}

export default NodeLoader