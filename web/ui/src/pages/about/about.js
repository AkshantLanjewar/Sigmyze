import React from "react"
import './about.scoped.scss'
import ContactForm     from "./sub-components/contact"

import {
    Container,
    Group,
    Text,
    Title,
    SimpleGrid,
    ThemeIcon
} from '@mantine/core'

import { BiBarChart }     from 'react-icons/bi'
import { IoIosAnalytics } from 'react-icons/io'
import { AiFillDatabase } from 'react-icons/ai'

import useStyles from "./about.styles"

const About = ({  }) => {
    const { classes } = useStyles()
    
    return (
        <div className="about-wrapper">
            <header className={classes.header}>
                <Container>
                    <div className={classes.headerContainer}>
                        <Text weight={"bold"}>Sigmyze Mission</Text>

                        <Title className={classes.headerTitle}>
                            To <span className={classes.headerSpan}>Democratize</span>
                            <br /> <span className={classes.altHeaderSpan}>Data</span> & <span className={classes.altHeaderSpan}>Analysis</span>
                        </Title>

                        <SimpleGrid
                            cols={3}
                            spacing={"xl"}
                            breakpoints={[{ maxWidth: 755, cols: 1, spacing: 'lg' }]}
                            className={classes.headerFeatures}
                        >
                            <div>
                                <ThemeIcon size={44}>
                                    <IoIosAnalytics size={20} />
                                </ThemeIcon>

                                <div className={classes.featureBody}>
                                    <Text className={classes.featureTitle}>Analytics</Text>
                                    <Text className={classes.featureDescription}>
                                        Gain insights from unconventional data sources
                                        by leveraging powerful analytical tools
                                    </Text>
                                </div>
                            </div>

                            <div>
                                <ThemeIcon size={44}>
                                    <BiBarChart size={20} />
                                </ThemeIcon>

                                <div className={classes.featureBody}>
                                    <Text className={classes.featureTitle}>Charting</Text>
                                    <Text className={classes.featureDescription}>
                                        Create and save multiple different chart types
                                        with multiple axes
                                    </Text>
                                </div>
                            </div>

                            <div>
                                <ThemeIcon size={44}>
                                    <AiFillDatabase size={20} />
                                </ThemeIcon>

                                <div className={classes.featureBody}>
                                    <Text className={classes.featureTitle}>Data</Text>
                                    <Text className={classes.featureDescription}>
                                        Leverage a wide variety of pre cleaned datasets
                                        hosted by Sigmyze
                                    </Text>
                                </div>
                            </div>
                        </SimpleGrid>
                    </div>
                </Container>
            </header>

            <div className="section">
                <Container mt={"xl"} size={"lg"}>
                    <ContactForm />
                </Container>
            </div>
        </div>
    )
}

export default About