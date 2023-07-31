import { memo } from "react";
import { IDatasetCard } from "../../../data/quanta/dataset-api";
import ApplicationLayout from "../../../nav-elements/application-layout";
import styles from '../../../../pages/datasets/datasets.module.scss'
import { Card, CardSection, Container, SimpleGrid, Text, Title } from "@mantine/core";
import Footer from "../../../nav-elements/footer/footer";
import { NextRouter } from "next/router";
import { IconAtom2 } from "@tabler/icons";

interface IViewProps {
    datasetCards: IDatasetCard[],
    router: NextRouter
}

const PublicDatasetView: React.FC<IViewProps> = memo(({ datasetCards, router }) => (
    <>
        <ApplicationLayout
            title="Sigmyze Datasets"
            description=""
            location="/datasets"
            protectedView={false}
            darken={true}
        >
            <div>
                <header className={styles.header}>
                    <Container>
                        <div className={styles.headerContainer}>
                            <Text 
                                weight={"bold"}
                                color={"rgb(193, 194, 197)"}
                            >
                                Sigmyze Data
                            </Text>

                            <Title className={styles.headerTitle}>
                                <span className={styles.headerSpan}>700+ Economic Indicators</span>
                                <br /> hosted by Sigmyze
                            </Title>

                            <Text className={styles.headerDescription}>
                                Get to insights faster by leveraging hosted datasets provided by Sigmyze. Access pre cleaned,
                                and up to date data each time you start a new project. 
                            </Text>
                        </div>
                    </Container>
                </header>

                <main>
                    <Container
                        size={"lg"}
                        mb={32}
                        pb={"xl"}
                        px={"md"}
                        className={styles.wrapper}
                    >
                        <div className={styles.group}>
                            <div className={styles.header}>
                                <Title order={2} className={styles.title}>
                                    Published Datasets
                                </Title>

                                <Text size="sm" color="dimmed" className={styles.count}>{datasetCards.length} Dataset</Text>
                            </div>

                            <SimpleGrid
                                cols={4}
                                breakpoints={[
                                    { maxWidth: 1000, cols: 3 },
                                    { maxWidth: 755, cols: 2 },
                                    { maxWidth: 500, cols: 1 },
                                ]}
                            >
                                {datasetCards.map((step) => (
                                    <Card
                                        radius={"md"}
                                        className={styles.card}
                                        onClick={() => { router.push(`/public/quanta/${step.datasetId}`) }}
                                    >
                                        <CardSection className={styles.imageWrapper}>
                                            <IconAtom2 width={98} height={98} />
                                        </CardSection>

                                        <Text mt={"sm"} weight={"bold"}>{step.datasetName}</Text>
                                        <Text className={styles.description} size={"xs"}>{step.datasetId?.toLowerCase()}</Text>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </div>
                    </Container>
                </main>

                <Footer />
            </div>
        </ApplicationLayout>
    </>
))

export default PublicDatasetView