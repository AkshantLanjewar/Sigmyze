import { useState } from 'react'
import { HorizontalTicker } from 'react-infinite-ticker'
import IndicatorCard from '../visualization/indicator-card'
import styles from './home.module.scss'

const DataTicker: React.FC = ({ }) => {
    const [startTicker, setStartTicker] = useState(false)

    return (
        <div className={styles.ticker}>
            <div className={styles.small}>Get Started</div>

            <HorizontalTicker duration={10000} easing={"linear"}>
                <IndicatorCard />
                <IndicatorCard />
            </HorizontalTicker>
        </div>
    )
}

export default DataTicker