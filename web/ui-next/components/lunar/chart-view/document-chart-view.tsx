import { ParentSize } from "@visx/responsive"
import { useEffect, useState } from "react"
import { IGlobalChartSettings } from "../../data/lunar/types/chart-types"
import { IPresentationChart } from "../document-editor/blocks/types"
import styles from './chart-view.module.scss'
import ChartEngine from "./engine/chart-engine"
import { ILunarChart } from "./engine/types"
import { FetchIndicators, ParsePresentationSettings } from "./utils"

interface IDocumentChartViewProps {
    data: IPresentationChart,
    width: number,
    height: number
}

const DocumentChartView: React.FC<IDocumentChartViewProps> = ({ data, width, height }) => {
    const [chart, setChart] = useState<ILunarChart[]>([])
    const [globals, setGlobals] = useState<IGlobalChartSettings | undefined>(undefined)

    useEffect(() => {
        async function main() {
            let indicators = data.indicators
            let settings = data.chartSettings
            let node_id = data.node_id

            let charts = await FetchIndicators(indicators)
            charts = ParsePresentationSettings(charts, settings)
            setChart([ ...charts ])
        }

        main()
        let globals = data.chartGlobals
        setGlobals({ ...globals })
    }, [data])

    return (
        <div style={{ width: width, height: height }}>
            <ChartEngine 
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