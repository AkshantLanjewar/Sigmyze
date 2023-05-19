import styles        from  './datasets.module.scss'

import { 
    Container,
    Text,
    Title,
    SimpleGrid,
    Card, 
    CardSection
} from "@mantine/core"

import Image                         from "next/image"
import { GetServerSidePropsContext } from "next"

import { IDataset } from "../../components/data/datasets/DatasetsTypes"
import { 
    DatasetsTable,
    GetDatasets,
    IDatasetsTable 
} from "../../components/data/datasets/DatasetsAPI"
import { useRouter } from "next/router"
import Footer from "../../components/nav-elements/footer/footer"
import ApplicationLayout from "../../components/nav-elements/application-layout"

interface IDatasetProps {
    datasets?: Array<IDataset>;
}

const DatasetsPage: React.FC<IDatasetProps> = ({ datasets }) : JSX.Element => {
    const router = useRouter()

    return (
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
                                    <span className={styles.headerSpan}>60+ Economic Indicators</span>
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
                                        Economic Datasets
                                    </Title>

                                    <Text size="sm" color="dimmed" className={styles.count}>1 Dataset</Text>
                                </div>

                                <SimpleGrid
                                    cols={4}
                                    breakpoints={[
                                        { maxWidth: 1000, cols: 3 },
                                        { maxWidth: 755, cols: 2 },
                                        { maxWidth: 500, cols: 1 },
                                    ]}
                                >
                                    {datasets && (
                                        <div>
                                            {datasets.map((step: IDataset, i) => (
                                                <Card
                                                    radius={"md"}
                                                    className={styles.card}
                                                    onClick={() => { router.push(`/datasets/dataset/${step.name}`) }}
                                                >
                                                    <CardSection className={styles.imageWrapper}>
                                                        <Image
                                                            src={`data:image/png;base64,${step.logo}`}
                                                            height={150}
                                                            width={150}
                                                            alt={"Image Seal"}
                                                            className={styles.image}
                                                        />
                                                    </CardSection>

                                                    <Text mt={"sm"} weight={"bold"}>
                                                        {DatasetsTable[step.name as keyof IDatasetsTable]}
                                                    </Text>
                                                    <Text className={styles.description} size={"xs"}>{step.name.toUpperCase()}</Text>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </SimpleGrid>
                            </div>
                        </Container>
                    </main>

                    <Footer />
                </div>
            </ApplicationLayout>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const data = await GetDatasets()

    return {
        props: {
            datasets: data.datasets
        }
    }
}

export default DatasetsPage