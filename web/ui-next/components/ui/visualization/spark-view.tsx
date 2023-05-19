import { useEffect, useState } from "react"
import { IChartData } from "../../quanta/quanta-indicator-manager/types"
import { convertQuantaChartDataAnt } from "./utils"
import { config } from "./static-chart-config"
import styles from './spark-view.module.scss'
import dynamic from "next/dynamic"
const TinyArea = dynamic(() => import('@ant-design/plots').then(({ TinyArea }) => TinyArea),
    { ssr: false }
);

interface ISparkViewProps {
    data: IChartData[]
}

const SparkView: React.FC<ISparkViewProps> = ({ data }) => {
    const [settings, setSettings] = useState(config)
    
    useEffect(() => {
        let convertedData = convertQuantaChartDataAnt(data)
        let nSettings = settings

        let tinyData = [] as number[]
        for(let i = 0; i < convertedData.length; i++)
            tinyData.push(convertedData[i].value)

        nSettings['data'] = tinyData
        nSettings['meta'] = {}
        nSettings['meta']['formatter'] = (value: any) => {
            return `Value ${value}`
        }

        setSettings({ ...nSettings })
    }, [data])

    return (
        <div className={styles.spark__view}>
            <TinyArea { ...settings } />
        </div>
    )
}

export default SparkView