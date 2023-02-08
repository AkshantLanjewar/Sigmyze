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

                <div className={styles.roadmap}>
                    <div className={styles.sectionTitle}>Product Roadmap</div>

                    <div className={styles.roadmapWrapper}>
                        <div className={styles.roadmapItem}>
                            <div className={styles.styleRect}></div>
                            <div className={styles.sectionTitle}>Coming Soon</div>
                            <div className={styles.itemTitle}>A Blog!</div>
                            <div className={styles.itemDescription}>
                                With the addition of the blog, communication between us and you will become much 
                                more easier and frequent, giving you a more accurate peek of what's happening 
                                behind the scenes
                            </div>
                        </div>

                        <div className={styles.roadmapItem}>
                            <div className={styles.styleRect}></div>
                            <div className={styles.sectionTitle}>Coming Soon</div>
                            <div className={styles.itemTitle}>More Data!</div>
                            <div className={styles.itemDescription}>
                                We plan on rapidly expanding the number of datasets that we host. 
                                First by introducing more dynamic economic indicators, along with the stock and 
                                commodities markets.
                            </div>
                        </div>
                        
                        <div className={styles.roadmapItem}>
                            <div className={styles.styleRect}></div>
                            <div className={styles.sectionTitle}>Coming Soon</div>
                            <div className={styles.itemTitle}>More Integrations!</div>
                            <div className={styles.itemDescription}>
                                Making sure that our services can integrate with apps already in your workflow is key, 
                                and we plan on adding integrations for all major platforms to make adding visualizations 
                                as painless as possible
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