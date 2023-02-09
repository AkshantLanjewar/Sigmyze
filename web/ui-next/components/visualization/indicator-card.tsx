import dynamic from 'next/dynamic';
import styles from './indicator-card.module.scss'
import { config } from './static-chart-config'
const TinyArea = dynamic(() => import('@ant-design/plots').then(({ TinyArea }) => TinyArea),
    { ssr: false }
);

const IndicatorCard: React.FC = ({ }) => {
    return (
        <div className={styles.indicator__card}>
            <div className={styles.indicator__chart}>
                <TinyArea { ...config } />
            </div>

            <div className={styles.indicator__title}>
                <div className={styles.name}>Indicator Name</div>
                <div className={styles.indicator__id}>indicator_id</div>
            </div>
        </div>
    )
}

export default IndicatorCard