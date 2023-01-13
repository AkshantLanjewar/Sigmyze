import { IIndicator } from "../../../data/datasets/DatasetsTypes"
import { IIndicatorSetting } from "../../../data/lunar/types"

interface IChartRender {
    labels: Date[]
}

interface ChartDims {
    x: number,
    y: number
}

interface IChartMargin {
    top: number,
    right: number,
    left: number,
    bottom: number
}

interface ILunarChart {
    data: IChartData[],
    id: string,
    indicator: IIndicator,
    setting?: IIndicatorSetting
}

interface IChartData {
    date: Date,
    value: number | null
}

type linearScale = d3.ScaleLinear<number, number, never>

interface ID3Chart {
    type: string,
    id: string,
    color: string,
    name: string,
    rdScale: linearScale,
    data: IChartData[],
    setting?: IIndicatorSetting
}

interface IChartD3Scales {
    timescale?: d3.ScaleTime<number, number, never>,
    d3Charts?: ID3Chart[]
}

export const dummyData = [
    {
        date: new Date("2015"),
        value: 100
    },
    {
        date: new Date("2016"),
        value: 130
    },
    {
        date: new Date("2017"),
        value: null
    },
    {
        date: new Date("2018"),
        value: 170
    },
    {
        date: new Date("2019"),
        value: 150
    },
    {
        date: new Date("2020"),
        value: 170
    },
    {
        date: new Date("2021"),
        value: 190
    }
] as IChartData[]

export type { 
    IChartData,
    ILunarChart,
    IChartRender,
    ChartDims,
    IChartMargin,
    IChartD3Scales,
    ID3Chart
}