import dynamic from 'next/dynamic';
import { ChartDims, IChartD3Scales, IChartData, IChartMargin, IQuantaChart } from '../engine/types';
import { IGlobalChartSettings } from '../../../data/lunar/types/chart-types';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { processQuantaCharts } from './utils';
import QuantaEngineView from './engine-view';
import { QuantaDatasetManagerData } from '../../../ui/quanta-dataset-manager';
import { IDatasetManagerState } from '../../../ui/quanta-dataset-manager/types';

const AxisBottom = dynamic(() => import('@visx/axis').then(({ AxisBottom }) => AxisBottom),
    { ssr: false }
);

interface IChartEngineProps {
    width: number,
    height: number,
    charts?: IQuantaChart[],
    globals?: IGlobalChartSettings,
    display?: boolean
}

interface ITooltipState {
    tooltipOpen: boolean,
    tooltipLeft: number,
    tooltipTop: number,
    tooltipData?: IChartData[],
    vertLineLeft: number,
    longestIndex: number,
    chartArrays?: IChartData[][]
}

const defaultTooltipState = {
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: undefined,
    vertLineLeft: 0,
    longestIndex: 0
} as ITooltipState

const QChartEngine: React.FC<IChartEngineProps> = ({ width, height, charts, globals, display }) => {
    const divRef = useRef<HTMLDivElement | null>(null)
    const svgRef = useRef<SVGSVGElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement | null>(null)

    //state for the chart engine
    const [scales, setScales] = useState<IChartD3Scales | undefined>(undefined)
    const [boxDims, setBoxDims] = useState<ChartDims | undefined>(undefined)
    const [pathRefs, setPathRefs] = useState<any | undefined>(undefined)
    const [tooltipData, setTooltipData] = useState<ITooltipState>(defaultTooltipState)

    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    const margin: IChartMargin = useMemo(() => ({ top: 20, right: 50, bottom: 30, left: 30 }), [])
    
    //effects for the quanta chart engine
    useEffect(() => {
        async function main() {
            if(charts === undefined)
                return

            const dims: ChartDims = {
                x: width - margin.left - margin.right, 
                y: height - margin.top - margin.bottom 
            }

            let resp = await processQuantaCharts(charts, dims, fetchIndicatorText)
            setScales({ ...resp })
        }

        main()
    }, [charts, width, height, fetchIndicatorText])

    useEffect(() => {
        const calcWidth = width - margin.left - margin.right
        const calcHeight = height - margin.top - margin.bottom

        setBoxDims({ x: calcWidth, y: calcHeight })
    }, [width, height])

    //methods for the quanta chart engine
    const closeTooltip = useCallback(() => setTooltipData({ ...defaultTooltipState }), [])

    const setPathRef = useCallback((ref?: any) => {
        if(!ref) {
            setPathRefs(undefined)
            return
        }

        if(pathRefs === undefined)
            return

        let oPathRefs = pathRefs
        oPathRefs[ref.getAttribute('data-index')] = ref
        setPathRefs({ ...oPathRefs })
    }, [pathRefs])

    return (
        <>
            {boxDims && (
                <QuantaEngineView
                    ref={divRef}
                    svgRef={svgRef}
                    tooltipRef={tooltipRef}
                    width={width}
                    height={height}
                    display={display}
                    margin={margin}
                    scales={scales}
                    tooltipData={tooltipData}
                    charts={charts}
                    globals={globals}
                    boxDims={boxDims}
                    pathRefs={pathRefs}
                    setPathRef={setPathRef}
                    setTooltipData={setTooltipData}
                    closeTooltip={closeTooltip}
                />
            )}
        </>
    )
}

export default QChartEngine