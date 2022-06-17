import React, { useEffect, useState } from "react"

import {
    Group,
    Title,
    Text,
    SimpleGrid,
    Card,
    CardSection,
    Image
} from "@mantine/core"

import useStyles from '../../../../indicators/indicators.styles'
import { 
    Logo_Table, 
    Datasets_Table 
} from "../../../../../data/backend/weo-data"

import { GetDatasets } from "../../../../../data/server-interface"

const DatasetView = ({ setDataset, activeDataset }) => {
    const { classes }               = useStyles()
    const [datasets, setDatasets]   = useState([])

    async function main() {
        let d  = await GetDatasets()
        d      = d['datasets']
        let ds = []
        for(let i = 0; i < d.length; i++) {
            let dataset = d[i]
            let pack = { dataset: dataset, active: false }
            if(activeDataset == dataset)
                pack['active'] = true
            ds.push(pack)
        }

        setDatasets([...ds])
    }

    useEffect(() => {
        main()
    }, [])

    function SetActive(short) {
        let ds = []
        for(let i = 0; i < datasets.length; i++) {
            let dataset       = datasets[i]
            dataset['active'] = false
            if(dataset.dataset == short)
                dataset['active'] = true

            ds.push(dataset)
        }

        setDatasets([...ds])
        setDataset(short)
    }

    return (
        <div>
            <Group mb={"lg"}>
                <div className={classes.groupHeader}>
                    <Title order={2} className={classes.groupTitle}>
                        Economic Datasets
                    </Title>

                    <Text size="sm" color="dimmed" className={classes.groupCount}>{datasets.length} Dataset</Text>
                </div>

                <SimpleGrid
                    cols={3}
                    sx={{ width: "100%" }}
                >
                    {datasets.map((step) => (
                        <Card 
                            className={classes.card} 
                            radius={"md"} 
                            onClick={() => { SetActive(step.dataset) }}
                            sx={(theme) => ({
                                border: step.active ? `2px solid ${theme.colors.blue[4]}` : ''
                            })}
                        >
                            <CardSection className={classes.imageWrapper}>
                                <Image
                                    className={classes.image}
                                    src={Logo_Table[step.dataset]}
                                    alt={"IMF Seal"}
                                    height={150}
                                    width={150}
                                />
                            </CardSection>

                            <Text className={classes.cardTitle}>{Datasets_Table[step.dataset]}</Text>
                            <Text className={classes.cardDescription} size={"xs"}>{step.dataset.toUpperCase()}</Text>
                        </Card>
                    ))}
                </SimpleGrid>
            </Group>
        </div>
    )
}

export default DatasetView