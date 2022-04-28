import React from "react"

import {
    createStyles,
    Container,
    Text,
    Title,
    SimpleGrid,
    ThemeIcon,
    Card,
    CardSection,
    Image
} from "@mantine/core"

import { FaTape } from 'react-icons/fa'
import { BsBox } from 'react-icons/bs'

import useStyles from "./indicators.styles"

import IMFSeal from '../../assets/imf.png'

const Resources = ({  }) => {
    const { classes, cx } = useStyles()

    return (
        <div>
            <header className={classes.header}>
                <Container>
                    <div className={classes.headerContainer}>
                        <Text weight={"bold"}>Sigmyze Data</Text>

                        <Title className={classes.headerTitle}>
                            <span className={classes.headerSpan}>60+ Economic Indicators</span>
                            <br /> hosted by Sigmyze
                        </Title>

                        <Text className={classes.headerDescription}>
                            Get to insights faster by leveraging hosted datasets provided by Sigmyze. Access pre cleaned,
                            and up to date data each time you start a new project. 
                        </Text>

                        <SimpleGrid
                            cols={3}
                            spacing={"xl"}
                            breakpoints={[{ maxWidth: 755, cols: 1, spacing: 'lg' }]}
                            className={classes.headerFeatures}
                        >
                            <div>
                                <ThemeIcon size={44}>
                                    <FaTape size={20} />
                                </ThemeIcon>

                                <div className={classes.featureBody}>
                                    <Text className={classes.featureTitle}>Accuracy</Text>
                                    <Text className={classes.featureDescription}>
                                        All our data is sourced from the latest edtitions of the datasets from which they originate
                                    </Text>
                                </div>
                            </div>

                            <div>
                                <ThemeIcon size={44}>
                                    <BsBox size={20} />
                                </ThemeIcon>

                                <div className={classes.featureBody}>
                                    <Text className={classes.featureTitle}>Accessibility</Text>
                                    <Text className={classes.featureDescription}>
                                        Our data is always accesible whenever you use our platform
                                    </Text>
                                </div>
                            </div>
                        </SimpleGrid>
                    </div>
                </Container>
            </header>

            <main>
                <Container size={"lg"} mb={"xl"} px="md" className={classes.wrapper}>
                    <div className={classes.group}>
                        <div className={classes.groupHeader}>
                            <Title order={2} className={classes.groupTitle}>
                                Economic Datasets
                            </Title>

                            <Text size="sm" color="dimmed" className={classes.groupCount}>1 Dataset</Text>
                        </div>

                        <SimpleGrid
                            cols={4}
                            breakpoints={[
                                { maxWidth: 1000, cols: 3 },
                                { maxWidth: 755, cols: 2 },
                                { maxWidth: 500, cols: 1 },
                            ]}
                        >
                            <Card className={classes.card} radius={"md"}>
                                <CardSection className={classes.imageWrapper}>
                                    <Image
                                        className={classes.image}
                                        src={IMFSeal}
                                        alt={"IMF Seal"}
                                        height={150}
                                        width={150}
                                    />
                                </CardSection>

                                <Text className={classes.cardTitle}>World Economic Outlook</Text>
                                <Text className={classes.cardDescription} size={"xs"}>WEO</Text>
                            </Card>
                        </SimpleGrid>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default Resources