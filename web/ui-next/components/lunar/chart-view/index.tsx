import { useCallback, useContext, useEffect, useState } from "react"
import { ILunarState, IProjectNodeData } from "../../data/lunar/types/types"
import { LunarContextData } from "../../data/lunar/context"
import { IQuantaChart } from "./engine/types"
import { GetItem } from "../../data/lunar/functions/util-functions"
import { QuantaDatasetManagerData } from "../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../ui/quanta-dataset-manager/types"
import { FetchQuantaIndicators, ParseQuantaSettings } from "./quanta-utils"
import QuantaChartView_View from "./view"

interface IViewProps {
    tabId: string
}

const QuantaChartView: React.FC<IViewProps> = ({ tabId }) => {
    const [nodeData, setNodeData] = useState<IProjectNodeData | undefined>(undefined)
    const [nodeId, setNodeId] = useState<string | undefined>(undefined)
    const [charts, setCharts] = useState<IQuantaChart[]>([])

    const { fetchIndicator } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    const { 
        ui, 
        data,
        getNodeIdTab, 
        createGlobals, 
        getQuantaIndicatorSetting, 
        createIndicatorSetting,
        createSettings 
    } = useContext(LunarContextData) as ILunarState

    const fetchData = useCallback(() => {
        if(ui === null || ui === undefined || data === null || data === undefined)
            return

        let tab = undefined
        let tabs = ui.tabs
        for(let i = 0; i < tabs.length; i++) {
            let _tab = tabs[i]
            if(_tab.tab_id === tabId)
                tab = _tab
        }

        if(tab === undefined)
            return

        let node = GetItem(tab.linked_node_id, data.splits)
        if(node === null || node.data === undefined)
            return

        let nodeData = node.data
        setNodeData({ ...nodeData })

        let globals = node!.data!.chartGlobals
        let nodeId = getNodeIdTab(tabId)
        if(globals === undefined)
            createGlobals(nodeId)
    }, [ui, data, tabId, getNodeIdTab])

    const generateChart = useCallback(() => {
        async function main() {
            let indicators = nodeData?.quantaIndicators
            if(indicators === undefined || nodeId === undefined)
                return

            let newCharts = await FetchQuantaIndicators(indicators, fetchIndicator)
            newCharts = ParseQuantaSettings(nodeId, newCharts, getQuantaIndicatorSetting, createIndicatorSetting)
            setCharts([ ...newCharts ])
        }

        main()
    }, [nodeData])

    useEffect(() => {
        fetchData()
        let nodeId = getNodeIdTab(tabId)
        if(nodeId === null)
            return

        setNodeId(nodeId)
    }, [tabId])

    useEffect(() => {
        fetchData()
    }, [data])

    useEffect(() => {
        if(nodeId === null || nodeData === undefined || nodeId === undefined)
            return

        let settings = nodeData.chartSettings
        if(settings === undefined) {
            createSettings(nodeId)
            return
        }

        generateChart()
    }, [nodeData])

    return (
        <>
            {nodeData && (
                <QuantaChartView_View charts={charts} nodeData={nodeData} />
            )}
        </>
    )
}

export default QuantaChartView