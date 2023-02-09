import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { PrepareData } from '../chart/utils';
import { GetIndicator } from '../data/datasets/DatasetsAPI';
import { IIndicator, IUnparsedIndicator } from '../data/datasets/DatasetsTypes';
import styles from './indicator-card.module.scss'
import { config } from './static-chart-config'
const TinyArea = dynamic(() => import('@ant-design/plots').then(({ TinyArea }) => TinyArea),
    { ssr: false }
);

interface IIndicatorCardProps {
    indicator: IIndicator
}

const IndicatorCard: React.FC<IIndicatorCardProps> = ({ indicator }) => {
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState(config)

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

        setSettings({ ...oConfig })
        setLoading(false)
    }

    useEffect(() => {
        FetchData()
    }, [indicator])

    return (
        <div className={styles.indicator__card}>
            <div className={styles.indicator__chart}>
                <TinyArea { ...settings } />
            </div>

            <div className={styles.indicator__title}>
                <div className={styles.name}>
                    {indicator.object.object_id} {indicator.indicator.indicator_fullname}
                </div>

                <div className={styles.indicator__id}>
                    {indicator.object.object_fullname}:{indicator.indicator.indicator_id}
                </div>
            </div>
        </div>
    )
}

export default IndicatorCard