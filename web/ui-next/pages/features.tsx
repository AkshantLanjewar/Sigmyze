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

                    <div className={`${styles.section} ${styles.alt}`}>
                        <div className={`${styles.image} ${styles.documentEditor}`}></div>

                        <div className={styles.titleWrapper}>
                            <div className={styles.sigmyze}>Sigmyze</div>
                            <div className={styles.title}>
                                Data
                                <span className={styles.emphasize}> Presentation</span>
                            </div>

                            <div className={styles.descriptionWrapper}>
                                <div className={styles.description}>
                                    Stop hassling with trying to add charts into your documents, 
                                    our document editor treats charts as a first class element, making their 
                                    addition much easier.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.section} ${styles.tri}`}>
                        <div className={styles.titleWrapper}>
                            <div className={styles.sigmyze}>Sigmyze</div>
                            <div className={styles.title}>
                                <span className={styles.emphasize}>Cloud </span>
                                Storage
                            </div>

                            <div className={styles.descriptionWrapper}>
                                <div className={styles.description}>
                                    Don't stress about how to access your data, with Sigmyze, 
                                    your data is accessible from any Phone, Laptop or PC with an internet connection
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.image} ${styles.driveSs}`}></div>
                    </div>

                    <Footer />
                </>
            </ApplicationLayout>
        </div>
    )
}

export default FeaturesPage