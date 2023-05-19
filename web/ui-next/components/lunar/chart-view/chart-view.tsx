import { ParentSize } from '@visx/responsive';
import { useContext, useEffect, useState } from 'react';
import { LunarContextData } from '../../data/lunar/context';
import { GetItem } from '../../data/lunar/functions/functions';
import { DEFAULT_SETTINGS, IChartSettings, ILunarState, IProjectNodeData } from '../../data/lunar/types/types';
import styles from './chart-view.module.scss'
import ChartEngine from './engine/chart-engine';
import { ILunarChart } from './engine/types';
import { FetchIndicators, ParseSettings } from './utils';

interface IChartViewProps {
    tabId: string
}

const ChartView: React.FC<IChartViewProps> = ({ tabId }) => {
    const [nodeData, setNodeData] = useState<IProjectNodeData>({} as IProjectNodeData)   
    const [chart, setChart] = useState([] as ILunarChart[])
    const [nodeId, setNodeId] = useState<string | null>(null)

    const lunarContext = useContext(LunarContextData) as ILunarState
    const { ui, data } = lunarContext

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

        let globals = node!.data!.chartGlobals
        let nodeId = lunarContext.getNodeIdTab(tabId)
        if(globals === undefined)
            lunarContext.createGlobals(nodeId)
    }

    useEffect(() => {
        let nodeId = lunarContext.getNodeIdTab(tabId)
        setNodeId(nodeId)
    }, [])

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
        charts = ParseSettings(nodeId!, charts, lunarContext.getIndicatorSetting, lunarContext.createIndicatorSetting) 
        setChart([ ...charts ]) 
    }

    useEffect(() => {
        if(nodeId === null)
            return

        let settings = nodeData.chartSettings
        if(settings === undefined) {
            lunarContext.createSettings(nodeId)
            return
        }

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
                        globals={nodeData.chartGlobals}
                    />
                }
            </ParentSize>
        </div>
    )
}

export default ChartView