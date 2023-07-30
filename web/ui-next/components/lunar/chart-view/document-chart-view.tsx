import { useContext, useEffect, useState } from "react"
import { IGlobalChartSettings } from "../../data/lunar/types/chart-types"
import { IPresentationChart } from "../document-editor/blocks/types"
import { IQuantaChart } from "./engine/types"
import { FetchQuantaIndicators, ParseQuantaSettings } from "./quanta-utils"
import QChartEngine from "./q-engine"
import { QuantaDatasetManagerData } from "../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../ui/quanta-dataset-manager/types"
import { LunarContextData } from "../../data/lunar/context"
import { ILunarState } from "../../data/lunar/types/types"

interface IDocumentChartViewProps {
    data: IPresentationChart,
    width: number,
    height: number
}

const DocumentChartView: React.FC<IDocumentChartViewProps> = ({ data, width, height }) => {
    const [chart, setChart] = useState<IQuantaChart[]>([])
    const [globals, setGlobals] = useState<IGlobalChartSettings | undefined>(undefined)

    const { fetchIndicator } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    const { getQuantaIndicatorSetting, createIndicatorSetting } = useContext(LunarContextData) as ILunarState

    useEffect(() => {
        async function main() {
            let newCharts = await FetchQuantaIndicators(data.indicators, fetchIndicator)
            newCharts = ParseQuantaSettings(data.node_id, newCharts, getQuantaIndicatorSetting, createIndicatorSetting)
            setChart([ ...newCharts ])
        }

        main()
        let globals = data.chartGlobals
        setGlobals({ ...globals })
    }, [data])

    return (
        <div style={{ width: width, height: height }}>
            <QChartEngine 
                width={width}
                height={height}
                charts={chart}
                globals={globals}
                display={true}
            />
        </div>
    )
}

export default DocumentChartView