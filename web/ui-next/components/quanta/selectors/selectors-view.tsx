import styles from './selectors-view.module.scss'

const QuantaSelectorsView: React.FC = ({ }) => {
    return (
        <div className={styles.selectors__wrapper}>
            <div className={styles.selectors__list}>
                <div className={styles.title}>Dataset Selectors</div>

                
            </div>

            <div className={styles.selectors__viewport}>

            </div>
        </div>
    )
}

export default QuantaSelectorsView