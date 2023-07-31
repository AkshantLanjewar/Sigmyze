import { Accordion, Button, Title } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { IIndicator } from "../../data/datasets/DatasetsTypes"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import Footer from "../../nav-elements/footer/footer"
import styles from './home.module.scss'
import DataTicker from "./ticker"

interface IIndexPageProps {
    indicators: IIndicator[]
}

const IndexPage: React.FC<IIndexPageProps> = ({ indicators }) => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    useEffect(() => {
        if(loggedIn === true)
            router.replace('/drive')
    }, [])

    useEffect(() => {
        if(loggedIn === true)
            router.replace('/drive')
    }, [loggedIn])
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className={styles.hero}>
                <div className={styles.textContainer}>
                    <div className={styles.small}>Get Started</div>
                    <div className={styles.bold}>
                        Democratizing <span className={styles.focus}>Data</span> and 
                        <span className={styles.focus}> Analytics</span>
                    </div>

                    <div className={styles.actions}>
                        <Link href={"/auth/signup"}>
                            <Button
                                variant={"filled"}
                                color={"indigo"}
                                size={"lg"}
                                radius={"xl"}
                                py={1}
                            >
                                Get Started
                            </Button>
                        </Link>

                        <Link href={"/features"}>
                            <Button
                                variant={"subtle"}
                                color={"gray"}
                                size={"lg"}
                                radius={"xl"}
                                py={1}
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className={styles.imageContainer}>
                    <div className={styles.image}></div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.title}>Get Started</div>
                <div className={styles.semiFocus}>
                    A Platform that helps people 
                    <span className={styles.emphasize}> analyze</span> and 
                    <span className={styles.emphasize}> visualize </span>data faster.
                </div>

                <div className={styles.featureCards}>
                    <div className={styles.card}>
                        <div className={`${styles.image} ${styles.documentEditor}`}></div>

                        <div className={styles.text}>
                            <div className={styles.title}>Data Presentation</div>
                            <div className={styles.description}>
                                Integrate live visualizations into your documents
                            </div>
                        </div>

                        
                        <Link href={"/features"} className={styles.learn}>
                            <div className={styles.content}>Learn More</div>
                            <IconChevronRight size={16} stroke={2} />
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <div className={`${styles.image} ${styles.chartEditor}`}></div>

                        <div className={styles.text}>
                            <div className={styles.title}>Data Visualization</div>
                            <div className={styles.description}>
                                Build complex multi-variate visualizations in minutes
                            </div>
                        </div>

                        
                        <Link href={"/features"} className={styles.learn}>
                            <div className={styles.content}>Learn More</div>
                            <IconChevronRight size={16} stroke={2} />
                        </Link>
                    </div>

                    <div className={styles.card}>
                        <div className={`${styles.image} ${styles.drive}`}></div>

                        <div className={styles.text}>
                            <div className={styles.title}>Cloud Storage</div>
                            <div className={styles.description}>
                                Access your projects from anywhere at anytime
                            </div>
                        </div>

                        
                        <Link href={"/features"} className={styles.learn}>
                            <div className={styles.content}>Learn More</div>
                            <IconChevronRight size={16} stroke={2} />
                        </Link>
                    </div>
                </div>
            </div>

            <DataTicker indicators={indicators} />

            <div className={`${styles.section} ${styles.faq}`}>
                <div className={styles.title}>Questions?</div>
                <div className={styles.focus}>
                    <span className={styles.emphasize}>Questions </span> you may have before 
                    <span className={styles.emphasize}> Creating</span> an 
                    <span className={styles.emphasize}> Account</span>
                </div>

                <Accordion
                    variant={"separated"}
                    defaultValue={"datasets"}
                    radius={"md"}
                    mt={60}
                    sx={{ width: 730 }}
                >
                    <Accordion.Item value="datasets">
                        <Accordion.Control>
                            <Title order={3}>How many Datasets are hosted by Sigmyze</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            Currently we only host the World Economic Outlook dataset. 
                            In the future, we plan to incorporate more datasets, including datasets that 
                            refresh daily such as the stock market and commodities market.
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="formats">
                        <Accordion.Control>
                            <Title order={3}>What formats can I export</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            Currently there is no way to export content outside of Sigmyze. 
                            We are working on adding more editor content so that more people 
                            can use it in their daily activities.
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="data">
                        <Accordion.Control>
                            <Title order={3}>Can I bring my own Data?</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                            Currently we are in the planning stages for implementing this feature. 
                            While we are working on implementing this, we plan to add many hosted datasets in the meantime.
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </div>

            <Footer />
        </div>
    )
}

export default IndexPage