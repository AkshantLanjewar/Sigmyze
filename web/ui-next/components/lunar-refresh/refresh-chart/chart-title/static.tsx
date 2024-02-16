import styles from './index.module.scss'

interface IStaticTitleProps {
    /**
     * This is the controlled state for the chart title
     */
    chartTitle: string
}

const StaticTitle: React.FC<IStaticTitleProps> = ({ chartTitle }) => {
    return (
        <div 
            className={styles.chart__title}
            data-testId={'chart-title'}
            style={{ userSelect: 'none', top: 25, left: 50, fontWeight: 600 }}
        >
            {chartTitle}
        </div>
    )
}

export default StaticTitle
