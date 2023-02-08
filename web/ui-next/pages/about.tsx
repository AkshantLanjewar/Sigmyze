import { Box, Stack } from "@mantine/core"
import { IconCloudComputing, IconDeviceDesktopAnalytics, IconFileAnalytics } from "@tabler/icons"
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

                <div className={styles.chooseWrapper}>
                    <div className={styles.container}>
                        <div className={styles.sectionTitle}>The Best Tool</div>
                        <div className={styles.focusText}>Why Choose Sigmyze</div>

                        <div className={styles.cardWrapper}>
                            <div className={styles.card}>
                                <Box py={5}>
                                    <IconFileAnalytics 
                                        size={36} 
                                        stroke={2} 
                                        color={"#FFFFFF"}
                                    />
                                </Box>

                                <Stack spacing={12}>
                                    <div className={styles.cardTitle}>Seamless Editing</div>
                                    <div className={styles.styleRect}></div>
                                </Stack>

                                <Box py={10}>
                                    <div className={styles.description}>
                                        Don't waste  on silly things like formatting and layout. 
                                        With our node based text editor, you can edit and format documents much quicker. 
                                        Additionally, Data is treated as a first class citizen, making integrating interactive 
                                        visualizations into your documents much easier.
                                    </div>
                                </Box>
                            </div>

                            <div className={styles.card}>
                                <Box py={5}>
                                    <IconDeviceDesktopAnalytics 
                                        size={36} 
                                        stroke={2} 
                                        color={"#FFFFFF"}
                                    />
                                </Box>

                                <Stack spacing={12}>
                                    <div className={styles.cardTitle}>Powerful Visualizations</div>
                                    <div className={styles.styleRect}></div>
                                </Stack>

                                <Box py={10}>
                                    <div className={styles.description}>
                                        Combining different datasets into one single visualization has never been easier. 
                                        Instead of fumbling through multiple slow spreadsheets, in just a few clicks you can 
                                        start creating detailed, beautiful visualizations.
                                    </div>
                                </Box>
                            </div>

                            <div className={styles.card}>
                                <Box py={5}>
                                    <IconCloudComputing 
                                        size={36} 
                                        stroke={2} 
                                        color={"#FFFFFF"}
                                    />
                                </Box>

                                <Stack spacing={12}>
                                    <div className={styles.cardTitle}>Portable</div>
                                    <div className={styles.styleRect}></div>
                                </Stack>

                                <Box py={10}>
                                    <div className={styles.description}>
                                        Don’t ever worry about having to access your data again, with Sigmyze, 
                                        all your data travels with you., as long as you have an internet connection. 
                                        Additionally, share your documents with anyone, while preserving the visualizations 
                                        interactivity.
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </ApplicationLayout>
        </div>
    )
}

export default AboutPage