import { memo } from "react"
import styles from './chart-view.module.scss'
import { IQuantaChart } from "./engine/types"
import { IProjectNodeData } from "../../data/lunar/types/types"
import { ParentSize } from "@visx/responsive"
import QChartEngine from "./q-engine"

interface IViewProps {
    charts: IQuantaChart[],
    nodeData: IProjectNodeData
}

const QuantaChartView_View: React.FC<IViewProps> = memo(({
    charts,
    nodeData
}) => (
    <div className={styles.wrapper}>
        <ParentSize>
            {({ width, height }) => 
                <QChartEngine 
                    width={width}
                    height={height}
                    charts={charts}
                    globals={nodeData.chartGlobals}
                />
            }
        </ParentSize>
    </div>
))

export default QuantaChartView_View