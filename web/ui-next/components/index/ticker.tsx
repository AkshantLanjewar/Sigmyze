import { Group } from '@mantine/core'
import { HorizontalTicker } from 'react-infinite-ticker'
import { IIndicator } from '../data/datasets/DatasetsTypes'
import IndicatorCard from '../visualization/indicator-card'
import styles from './home.module.scss'

interface IDataTickerProps {
    indicators: IIndicator[]
}

const DataTicker: React.FC<IDataTickerProps> = ({ indicators }) => {
    return (
        <div className={styles.ticker}>
            <div className={styles.small}>Data we Host</div>

            <HorizontalTicker duration={100000} easing={"linear"} delay={0}>
                <Group spacing={25} pt={10} mr={25} noWrap>
                    {indicators.map((step) => (
                        <IndicatorCard indicator={step} />
                    ))}
                </Group>
            </HorizontalTicker>
        </div>
    )
}

export default DataTicker