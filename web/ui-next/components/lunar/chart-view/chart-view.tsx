import { ParentSize } from '@visx/responsive';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { LunarContextData } from '../../data/lunar/context/context';
import { GetItem } from '../../data/lunar/context/functions';
import { ILunarState, IProjectNodeData } from '../../data/lunar/types';
import styles from './chart-view.module.scss'
import ChartEngine from './engine/chart-engine';
import { ILunarChart } from './engine/types';
import { FetchIndicators } from './utils';

const Mix = dynamic(() => import('@ant-design/plots').then(({ Mix }) => Mix),
    { ssr: false }
);

interface IChartViewProps {
    tabId: string
}

const ChartView: React.FC<IChartViewProps> = ({ tabId }) => {
    const [nodeData, setNodeData] = useState<IProjectNodeData>({} as IProjectNodeData)
   
    const { ui, data } = useContext(LunarContextData) as ILunarState
    const [chart, setChart] = useState([] as ILunarChart[])

    function FetchData() {
        if(ui === null || ui === undefined)
            return
        if(data === null || data === undefined)
            return
        
        let tab = null
        for(let i = 0; i < ui.tabs.length; i++) {
            let tab_ = ui.tabs[i]
            if(tab_.tab_id === tabId)   
                tab = tab_
        }

        let node = null
        if(tab !== null)
            node = GetItem(tab.linked_node_id, data.splits)
        if(node !== null && node.data !== undefined) 
            setNodeData({ ...node.data })  
    }

    useEffect(() => {
          FetchData()
    }, [tabId])

    useEffect(() => {
        FetchData()
    }, [data])

    async function GenerateChart() {
        //check if the indicators is null
        let indicators = nodeData.indicators
        if(indicators === undefined)
            return

        let charts = await FetchIndicators(indicators)
        setChart([ ...charts ]) 
    }

    useEffect(() => {
        GenerateChart()
    }, [nodeData])

    return (
        <div className={styles.wrapper}>
            <ParentSize>
                {({ width, height }) => 
                    <ChartEngine 
                        width={width}
                        height={height}
                        charts={chart}
                    />
                }
            </ParentSize>
        </div>
    )
}

export default ChartView