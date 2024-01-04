import styles from './index.module.scss'

interface INoteTopbarProps {

}

const NoteTopbar: React.FC<INoteTopbarProps> = ({ }) => {
    return (
        <div
            data-testId={'document-topbar'}
            className={styles.topbar}
        >

        </div>
    )
}

export default NoteTopbar