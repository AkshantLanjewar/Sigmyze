import styles from './document-chart.module.scss'
import { Paper, Text, Title } from "@mantine/core"
import { IPresentationChart } from '../types'
import DocumentChartView from '../../../chart-view/document-chart-view'
import { ParentSize } from '@visx/responsive'
import { ChartDims } from '../../../chart-view/engine/types'
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react'

interface IDocumentChartProps {
    data?: IPresentationChart,
    title?: string,
    caption?: string,
    display?: boolean,
    dims?: ChartDims,
}

const DocumentChart: React.FC<IDocumentChartProps> = ({ data, title, caption, display, dims }) => {
    const [chartHeight, setChartHeight] = useState(0)

    //effect to size the chart container div
    useEffect(() => { 
        if(display === true)
            return
        if(dims === undefined)
            return

        let height = dims.y
        height -= 64
        height -= 44
        setChartHeight(height)
    }, [dims])  

    //additional styles for the chartstyles div
    let chartStyles = {} as CSSProperties
    if(display !== true)
        chartStyles['height'] = chartHeight

    return (
        <Paper
            radius={"md"}
            shadow={"md"}
            className={`${styles.chartContainer} ${display && styles.display}`}
        >
            <div className={styles.chartHeader}>
                <Title order={3}>{title}</Title>
            </div>

            <div className={styles.chartContent} style={chartStyles}>
                {data && (
                    <ParentSize>
                        {({ width, height }) => 
                            <DocumentChartView 
                                data={data} 
                                width={width}
                                height={height}
                            />
                        }
                    </ParentSize>
                )}
            </div>
            
            {caption && caption.trim().length > 0 && (
                <div className={styles.chartCaption}>
                    <Text size={'xs'} color={'dimmed'}>
                        {caption}
                    </Text>
                </div>
            )}
        </Paper>
    )
}

export default DocumentChart