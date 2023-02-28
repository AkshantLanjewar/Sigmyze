import styles from '../node-renderer.module.scss'

const DynamicOutput: React.FC = ({ }) => {
    return (
        <div className={styles.dynamic__node}>
            <div className={styles.title}>Dynamic Output</div>
        </div>
    )
}

export default DynamicOutput