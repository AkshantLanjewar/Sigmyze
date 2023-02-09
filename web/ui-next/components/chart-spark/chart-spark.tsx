import styles from './chart-spark.module.scss'


import { v4 as uuid } from 'uuid'
import { LoadingOverlay } from '@mantine/core'
import { useState, useEffect } from 'react'
import { IIndicator, IUnparsedIndicator } from '../data/datasets/DatasetsTypes'
import { GetIndicator } from '../data/datasets/DatasetsAPI'
import { PrepareData } from '../chart/utils'

import dynamic from 'next/dynamic'
import { ILineData } from '../chart/antv/antv-chart-types'
const TinyArea = dynamic(() => import('@ant-design/plots').then(({ TinyArea }) => TinyArea),
    { ssr: false }
);

interface IChartSparkIndicator {
    indicator: IIndicator,
    id: string,
    checks?: string[],
    deleteEntry?: (id: string) => void
}

const data = [1, 2, 3, 4, 5]

const ChartSpark: React.FC<IChartSparkIndicator> = ({ indicator, id, checks, deleteEntry }): JSX.Element => {
    const [loading, setLoading] = useState(false)
    const [config, setConfig]   = useState({
        autoFit: true,
        data,
        smooth: true,
        color: 'red',
        pattern: {
            type: 'line',
            cfg: {
                stroke: '#364fc7',
                backgroundColor: '#141517',
                fill: '#000000'
            },
            backgroundColor: 'white'
        }, 
        
        areaStyle: {
            fill: 'white'
        },

        line: {
            size: 2,
            color: '#364fc7'
        },

        type: 'areaStyle'
    } as any)

    async function FetchData() {
        setLoading(true)

        let object_id      = indicator.object.object_id
        let indicator_id   = indicator.indicator.indicator_id
        let indicator_data = await GetIndicator(indicator.dataset, object_id, indicator_id)

        let unparsed_indicator            = {} as IUnparsedIndicator
        unparsed_indicator.indicator      = indicator
        unparsed_indicator.indicator_data = indicator_data.indicator.indicator_data!
        let nData = await PrepareData([ unparsed_indicator ])
        
        let cData = [] as number[]
        for(let i = 0; i < nData.labels.length; i++)
            cData.push(nData.data[0].data[i])

        let oConfig = config
        oConfig['data'] = cData
        if(checks !== undefined && checks.indexOf("deleteIfEmpty") >= 0 && deleteEntry !== undefined && cData.length === 0)
            deleteEntry(id)
        
        setConfig({ ...oConfig })
        setLoading(false)
    }

    useEffect(() => {
        FetchData()
    }, [indicator])

    return (
        <div className={styles.spark}>
            <LoadingOverlay
                visible={loading}
                overlayBlur={2}
                loaderProps={{
                    color: "cyan",
                    variant: "bars"
                }}
            />
        
            <TinyArea theme={{ defaultColor: "#141517" }} { ...config } />
        </div>
    )
}

export default ChartSpark