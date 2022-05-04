import React, { useState, useEffect } from "react"

import {
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

import { GetDatasets } from "../../data/backend/datasets"
import { 
    Logo_Table,
    Datasets_Table 
} from "../../data/backend/weo-data"

const Resources = ({  }) => {
    const { classes, cx } = useStyles()
    const [datasets, setDatasets] = useState([])

    async function main() {
        let data = await GetDatasets()
        data     = data['datasets']
        setDatasets([...data])
    }
    
    useEffect(() => {
        main()
    }, [])

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
                            {datasets.map((step) => (
                                <Card className={classes.card} radius={"md"} onClick={() => { window.location.replace(`/datasets/${step}`) }}>
                                    <CardSection className={classes.imageWrapper}>
                                        <Image
                                            className={classes.image}
                                            src={Logo_Table[step]}
                                            alt={"IMF Seal"}
                                            height={150}
                                            width={150}
                                        />
                                    </CardSection>

                                    <Text className={classes.cardTitle}>{Datasets_Table[step]}</Text>
                                    <Text className={classes.cardDescription} size={"xs"}>{step.toUpperCase()}</Text>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default Resources