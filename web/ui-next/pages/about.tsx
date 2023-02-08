import ApplicationLayout from "../components/nav-elements/application-layout"
import Footer from "../components/nav-elements/footer/footer"
import styles from '../styles/info.module.scss'

const AboutPage: React.FC = ({ }) => {
    return (
        <div>
            <ApplicationLayout
				title="About Sigmyze"
				description="Our Mission is to make life easier when it comes to handling data. Whether it is visualization,"
				location="/about"
				protectedView={false}
                darken={true}
			>
                <div className={styles.hero}>
                    <div className={styles.title}>Additional Info</div>

                    <div className={styles.mission}>
                        Our Mission is to make life easier when it comes to handling data. 
                        Whether it is visualization, analysis, or integration into presentation formats, 
                        we strive to save you time.
                    </div>
                </div>

                

                <Footer />
            </ApplicationLayout>
        </div>
    )
}

export default AboutPage