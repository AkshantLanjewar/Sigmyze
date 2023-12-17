import styles from './index.module.scss'
import { ISigmyzeMargin } from './types'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { LinePath } from '@visx/shape'
import { curveBasis } from '@vx/curve'
import { Group } from '@visx/group'
import { Motion, spring } from 'react-motion'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getPathYFromX } from './findPathAtY'
import useQuantaChartData from './hooks/quanta-data'
import { QuantaDatasetManagerData } from '../../../ui/quanta-dataset-manager'
import { IDatasetManagerState } from '../../../ui/quanta-dataset-manager/types'
import { IQuantaIndicatorLoc } from '../../data-manager/state'
import useRefreshTooltip from './hooks/refresh-tooltip'
import ILunarLeftAxis from './parts/left-axis'
import ILunarBottomAxis from './parts/bottom-axis'
import PathRenderer from './parts/path-renderer'
import BallRenderer from './parts/ball-renderer'
import { ScaleLinear, ScaleTime } from 'd3'
import { LoadingOverlay } from '@mantine/core'

interface IRefreshEngineProps {
    width: number,
    height: number,

    /**
     * These are the indicators to be rendered within the chart
     */
    indicators: IQuantaIndicatorLoc[]
}

const RefreshEngine: React.FC<IRefreshEngineProps> = ({ width, height, indicators }) => {
    const { fetchIndicator } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    //theese are the refs for the line-paths based on their rendered index
    const collectedLineRefs = useRef<{[key: number]: SVGPathElement | null}>({})
    //this is the ref for the chart container svg
    const refreshRef = useRef<SVGSVGElement>(null)

    const margin: ISigmyzeMargin = {
        top: 20, 
        left: 40, 
        bottom: 25, 
        right: 45
    }

    const xMax = width - margin.left - margin.right
    const yMax = height - margin.top - margin.bottom

    //this is the hook that renders the chart data
    const { loading, renderedSeries, dateScale, rightScale } = useQuantaChartData(
        indicators, 
        xMax, 
        yMax, 
        fetchIndicator
    )

    //this is the hook that handles the tooltip state
    const {
        tooltipOpen,
        leftLinePos,
        tooltipMouseLeave,
        tooltipMouseMove,
        tooltipTouchMove
    } = useRefreshTooltip(renderedSeries, refreshRef, xMax, yMax, margin, dateScale)

    const collectLineRef = useCallback((element: SVGPathElement | null, index: number) => {
        let collectedRefs = collectedLineRefs.current
        collectedRefs[index] = element

        collectedLineRefs.current = collectedRefs
    }, [])

    const getPathYFromXCB = useCallback((index: number, x: number) => {
        let collectedRefs = collectedLineRefs.current
        if(Object.keys(collectedRefs).includes(`${index}`) === false)
            return

        let pathRef = collectedRefs[index]
        if(pathRef === null)
            return

        let strIndex = `${index}`
        return getPathYFromX(x, pathRef, strIndex)
    }, [])

    const dateCheck = dateScale !== null && dateScale !== undefined
    const seriesCheck = renderedSeries !== null && renderedSeries !== undefined
    const rightCheck = rightScale !== null && rightScale !== undefined

    const ready = dateCheck && seriesCheck && rightCheck

    return (
        <div className={styles.engine__container}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                radius={"md"}
                overlayBlur={2}
                loaderProps={{ type: 'bars', color: 'teal' }}
            />

            {ready
                ? (
                    <svg 
                        width={width} 
                        height={height}
                        ref={refreshRef}
                    >
                        <rect x={0} y={0} width={width} height={height} fill="#101113" />   
                                        
                        <ILunarLeftAxis margin={margin} rightScale={rightScale} />
                        <ILunarBottomAxis height={height} margin={margin} dateScale={dateScale} />

                        <Group top={margin.top} left={margin.left}>
                            <PathRenderer
                                renderedSeries={renderedSeries}
                                dateScale={dateScale!}
                                rightScale={rightScale!}
                                curveBasis={curveBasis}
                                collectLineRef={collectLineRef}
                            />

                            <BallRenderer
                                leftLinePos={leftLinePos}
                                tooltipOpen={tooltipOpen}
                                renderedSeries={renderedSeries}
                                getPathYFromXCB={getPathYFromXCB}
                            />

                            {xMax > 0 && (
                                <rect
                                    x={0}
                                    y={0}
                                    width={width}
                                    height={height}
                                    fill='transparent'
                                    onMouseLeave={(e) => tooltipMouseLeave(e)}
                                    onMouseMove={(e) => tooltipMouseMove(e)}
                                    onTouchMove={(e) => tooltipTouchMove(e)}
                                />
                            )}
                        </Group>
                    </svg>
                )
                : null
            }
        </div>
    )
}

export default RefreshEngine