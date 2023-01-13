import styles from './d3-chart-title.module.scss'
import { FocusTrap, Group, Indicator, MantineNumberSize, Text, TextInput } from "@mantine/core"
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { IGlobalChartSettings, IIndicatorSetting, ILunarState, ILunarUIData, IProjectNode } from "../../../data/lunar/types"
import { ChartDims, IChartMargin, ID3Chart, ILunarChart } from "../engine/types"
import { useClickOutside } from '@mantine/hooks'
import { LunarContextData } from '../../../data/lunar/context/context'
import { ITooltipState } from './d3-tooltip'
import { CompareIndicators } from '../../../data/lunar/context/chart-functions'

interface ID3ChartTitleProps {
    margin: IChartMargin,
    globals?: IGlobalChartSettings,
    indicators?: ID3Chart[],
    tooltipData: ITooltipState,
    charts?: ILunarChart[]
}

const D3ChartTitle: React.FC<ID3ChartTitleProps> = ({ margin, globals, indicators, tooltipData, charts }) => {
    const innerMargin = {
        left: 0,
        top: 20
    } as IChartMargin

    const [chartTitle, setChartTitleLocal] = useState<string>("")
    const [nodeId, setNodeId] = useState<string | null>(null)
    const [indicatorsData, setIndicators] = useState<IIndicatorSetting[]>([])

    const { 
        ui, 
        setChartTitle,
        getNodeIdTab,
        getNode 
    } = useContext(LunarContextData) as ILunarState

    useEffect(() => {
        if(globals === undefined)
            return

        setChartTitleLocal(globals.chartTitle)
    }, [globals?.chartTitle])

    useEffect(() => {
        let activeTab = ui!.activeTab
        if(activeTab === null)
            return

        //get the nodeId
        let nodeId_ = getNodeIdTab(activeTab)
        setNodeId(nodeId_)
    }, [])

    useEffect(() => {
        if(nodeId === null)
            return
        if(indicators === undefined)
            return

        let node = getNode(nodeId) as IProjectNode | null
        let indicatorSettings = node?.data?.chartSettings?.indicatorSettings
        if(indicatorSettings === undefined)
            return
        
        setIndicators([ ...indicatorSettings ])
    }, [indicators])

    return (
        <div
            style={{
                position: 'absolute',
                top: margin.top + innerMargin.top,
                left: margin.left + innerMargin.left,

                display: 'flex',
                flexDirection: 'column',
                gap: 2.5
            }}
        >
            <ClickItem
                ui={ui}
                value={chartTitle}
                size={"lg"}
                weight={"bold"}
                type={"chart-title"}
                setChartTitle={setChartTitle}
                nodeId={nodeId}
            />

            {indicators?.map((step, index) => {
                let indicator = step.setting?.indicator
                let setting = null
                if(indicator === undefined)
                    return null

                for(let i = 0; i < indicatorsData.length; i++) {
                    let indicator_setting = indicatorsData[i]
                    let indicator_i = indicator_setting.indicator

                    if(CompareIndicators(indicator, indicator_i) === true)
                        setting = indicator_setting
                }
                if(setting === null)
                    return null

                return (
                    <IndicatorTitleItem
                        setting={setting}
                        index={index}
                        tooltipData={tooltipData}
                        charts={charts}
                    />
                )
            })}
        </div>
    )
}

//indicator item
interface IIndicatorTitleItemProps {
    setting: IIndicatorSetting,
    index: number,
    tooltipData: ITooltipState,
    charts?: ILunarChart[]
}

const IndicatorTitleItem: React.FC<IIndicatorTitleItemProps> = ({ setting, index, tooltipData, charts }): JSX.Element => {
    const [indicatorValue, setIndicatorValue] = useState<number | null>(null)

    useEffect(() => {
        let data = tooltipData.tooltipData
        if(data === undefined)
            return

        let item = data[index]
        if(item === undefined)
            setIndicatorValue(null)
        else
            setIndicatorValue(item.value)
    }, [tooltipData])

    useEffect(() => {
        //set the indicator value to the latest
        if(charts === undefined)
            return

        if(tooltipData.tooltipOpen === false) {
            let chart = charts[index]
            let data = chart.data
            
            setIndicatorValue(data[data.length - 1].value)
        }
    }, [tooltipData.tooltipOpen])

    return (
        <div className={styles.clickItem}>
            <Group position='apart'>
                <Group position={'apart'} spacing={5}>
                    <div 
                        className={styles.dot} 
                        style={{
                            backgroundColor: setting.lineColor ? setting.lineColor : 'inherit'
                        }}
                    />

                    <Text
                        size={"sm"}
                        weight={"bold"}
                    >
                        DEU:NGDP_R
                    </Text>
                </Group>

                <Text
                    size={"xs"}
                    weight={"bold"}
                    transform={"uppercase"}
                >
                    {indicatorValue}
                </Text>
            </Group>
        </div>
    )
}

//click item
interface IClickItemProps {
    ui: ILunarUIData | null | undefined,
    nodeId: string | null,
    value: string,
    size: MantineNumberSize,
    weight: string,
    useActive?: boolean,
    type?: string
    setChartTitle: Function
}

const ClickItem: React.FC<IClickItemProps> = 
    ({ ui, nodeId, value, size, weight, useActive, type, setChartTitle }) => {
    const [active, setActive] = useState(false)
    const [dims, setDims] = useState<ChartDims>({ x: 0, y: 0 })
    const [tmpVal, setTmpVal] = useState("")

    function onClickChange(e: ChangeEvent<HTMLInputElement>) {
        setTmpVal(e.target.value)
    }

    function TitleBlur() {
        if(ui === null || ui === undefined)
            return
        if(tmpVal === "")
            return
        
        setChartTitle(nodeId, tmpVal)
        setTmpVal("")
    }

    const ref = useClickOutside<HTMLDivElement>(() => setActive(false))
    function ItemClicked() {
        const boundingRect = ref.current.getBoundingClientRect()

        setDims({ x: boundingRect.width, y: boundingRect.height })

        if(useActive === undefined || useActive === true)          
            setActive(true)
    }

    useEffect(() => {
        if(active)
            setTmpVal(value)
        else {
            if(type === 'chart-title')
                TitleBlur()

            setTmpVal('')
        }
    }, [active])

    return (
        <div 
            ref={ref}
            className={`${styles.clickItem} ${active ? styles.active : null}`}
            onClick={(e) => ItemClicked()}
            style={{
                width: 'auto',
                height: active ? dims.y : 'auto',
                minWidth: active ? dims.x : 0
            }}
        >
            {active
                ? (
                    <FocusTrap active={true}>
                        <div>
                            <input
                                className={styles.textInput}
                                data-autofocus
                                value={tmpVal}
                                onChange={onClickChange}
                            />
                        </div>
                    </FocusTrap>
                )
                : (
                    <Text 
                        size={size}
                        weight={weight}
                    >
                        {value}
                    </Text>
                )
            }
        </div>
    )
}

export default D3ChartTitle