import styles    from './chart-card.module.scss'
import SparkLine from '../chart/spark-line'

import { 
    IIndicator,
    IUnparsedIndicator 
} from "../data/datasets/DatasetsTypes"

import { PrepareData }  from '../chart/utils'
import { GetIndicator } from '../data/datasets/DatasetsAPI'

import { useEffect, useState } from 'react'

import { 
    Card,
    Text,
    LoadingOverlay 
} from "@mantine/core"

interface IChartCardProps {
    indicator: IIndicator
}

const ChartCard: React.FC<IChartCardProps> = ({ indicator }): JSX.Element => {
    const [textData, setTextData] = useState({
        title: "",
        description: ""
    })

    const [loading, setLoading] = useState(false)
    const [data, setData]       = useState({
        labels: ["one", "two", "three", "four", "five", "six"],
        data: [{
            label: "Error: Data has not Loaded",
            data: [1, 2, 3, 4, 2, 6]
        }],
    })

    async function FetchData() {
        setLoading(true)

        let object_id      = indicator.object.object_id
        let indicator_id   = indicator.indicator.indicator_id
        let indicator_data = await GetIndicator(indicator.dataset, object_id, indicator_id)

        let unparsed_indicator            = {} as IUnparsedIndicator
        unparsed_indicator.indicator      = indicator
        unparsed_indicator.indicator_data = indicator_data.indicator.indicator_data!
        let n_data = await PrepareData([unparsed_indicator])

        setData({ ...n_data })
        setLoading(false)
    }

    function main() {
        let title = `${indicator.object.object_fullname} ${indicator.indicator.indicator_fullname}`
        let desc  = `${indicator.object.object_id}:${indicator.indicator.indicator_id}`

        FetchData()
        setTextData({
            title: title,
            description: desc
        })
    }

    useEffect(() => {
        main()
    }, [])

    useEffect(() => {
        main()
    }, [indicator])

    return (
        <>
            <Card
                radius={"md"}
                className={styles.card}
            >
                <Card.Section className={styles.chart}>
                    <LoadingOverlay
                        visible={loading}
                        overlayBlur={2}
                        loaderProps={{
                            color: "cyan",
                            variant: "bars"
                        }}
                    />

                    <SparkLine 
                        data={data.data}
                        labels={data.labels}
                    />
                </Card.Section>

                <div className={styles.body}>
                    <Text className={styles.title}>{textData.title}</Text>
                    <Text className={styles.description}>{textData.description}</Text>
                </div>
            </Card>
        </>
    )
}

export default ChartCard