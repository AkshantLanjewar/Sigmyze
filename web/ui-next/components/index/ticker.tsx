import { Group } from '@mantine/core'
import { useState } from 'react'
import { HorizontalTicker } from 'react-infinite-ticker'
import IndicatorCard from '../visualization/indicator-card'
import styles from './home.module.scss'

const DataTicker: React.FC = ({ }) => {
    const [startTicker, setStartTicker] = useState(false)

    return (
        <div className={styles.ticker}>
            <div className={styles.small}>Get Started</div>

            <HorizontalTicker duration={15000} easing={"linear"} delay={0}>
                <Group spacing={25} pt={10} mr={25} noWrap>
                    <IndicatorCard />
                    <IndicatorCard />
                </Group>
            </HorizontalTicker>
        </div>
    )
}

export default DataTicker