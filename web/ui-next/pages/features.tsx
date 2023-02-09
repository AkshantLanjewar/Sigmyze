import ApplicationLayout from "../components/nav-elements/application-layout"
import Footer from "../components/nav-elements/footer/footer"
import styles from '../styles/feature.module.scss'

const FeaturesPage: React.FC = ({ }) => {
    return (
        <div>
            <ApplicationLayout
                title="Sigmyze Features"
				description="Save  time building complex multivariate visualizations by leveraging our platform"
				location="/about"
				protectedView={false}
                darken={true}
            >
                <>
                    <div className={styles.section}>
                        <div className={styles.titleWrapper}>
                            <div className={styles.sigmyze}>Sigmyze</div>
                            <div className={styles.title}>
                                Data
                                <span className={styles.emphasize}> Visualization</span>
                            </div>

                            <div className={styles.descriptionWrapper}>
                                <div className={styles.description}>
                                    Save time building complex multivariate visualizations by leveraging our platform to 
                                    get better insights, faster.
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.image} ${styles.chartEditor}`}></div>
                    </div>

                    <Footer />
                </>
            </ApplicationLayout>
        </div>
    )
}

export default FeaturesPage