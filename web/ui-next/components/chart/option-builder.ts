import { Chart } from "chart.js/auto"
import { CrosshairPlugin } from 'chartjs-plugin-crosshair'

import {
    IChartState,
    IChartOptions,
    IChartLayout,
    IChartScales,
    IChartDataset,
    IChartScale,
    ILegendOptions,
    IChartPlugins,
    ITooltipOptions,
    ICrosshairOptions,
    ICrosshairLine,
    ICrosshairZooming,
    ICrosshairSnap,
    IChartInteractions,
    IChartTooltips
} from './option-types'

class LunarChartBuilder {
    state: IChartState
    options: IChartOptions
    chart?: Chart

    constructor() {
        this.state   = {} as IChartState
        this.options = {} as IChartOptions

        //state
        this.state.labels   = [] as Array<string>
        this.state.datasets = [] as Array<IChartDataset>

        //options
        this.options.layout      = {} as IChartLayout
        this.options.scales      = {} as IChartScales
        this.options.plugins     = {} as IChartPlugins
        this.options.interaction = {} as IChartInteractions
        this.options.tooltips    = {} as IChartTooltips

        this.options.interaction.intersect = false

        this.options.maintainAspectRatio = false

        this.options.plugins.legend    = {} as ILegendOptions
        this.options.plugins.tooltip   = {} as ITooltipOptions
        this.options.plugins.crosshair = {} as ICrosshairOptions

        this.options.plugins.crosshair.line       = {} as ICrosshairLine
        this.options.plugins.crosshair.line.color = 'white'
        this.options.plugins.crosshair.line.width = 2
        this.options.plugins.crosshair.line.dashPattern = [15, 10]

        this.options.plugins.crosshair.zoom         = {} as ICrosshairZooming
        this.options.plugins.crosshair.zoom.enabled = false

        this.options.plugins.crosshair.snap          = {} as ICrosshairSnap
        this.options.plugins.crosshair.snap!.enabled = true

        this.options.plugins.tooltip.position = "nearest"
        this.options.plugins.tooltip.intersect = false

        this.options.layout.autoPadding = false
        this.options.layout.padding     = 50
    }

    ClearData() {
        this.state          = {} as IChartState
        this.state.labels   = [] as Array<string>
        this.state.datasets = [] as Array<IChartDataset>
    }

    AddDataset(dataset_id: string, data: Array<number>) {
        let n_dataset        = {} as IChartDataset
        n_dataset.type       = 'line'
        n_dataset.dataset_id = dataset_id
        n_dataset.data       = data
        n_dataset.tension    = 0.25

        this.state.datasets.push(n_dataset)
    }

    SetDatasetPointStyle(dataset_id: string, value: string | boolean) {
        let index = this.getDatasetIndex(dataset_id)
        this.state.datasets[index].pointStyle = value
    }

    AddScale(scale_id: string) {
        this.options.scales![scale_id] = {} as IChartScale
    }

    SetScaleDisplay(scale_id: string, display: boolean) {
        this.options.scales![scale_id].display = display
    }

    SetLegendDisplay(display: boolean) {
        this.options!.plugins!.legend!.display = display
    }

    SetLabels(labels: Array<string>) {
        this.state.labels = labels
    }

    SetPadding(padding: number) {
        this.options.layout!.padding = padding
    }

    SetTooltipsEnabled(enabled: boolean) {
        this.options.plugins!.tooltip!.enabled = enabled
    }

    SetLabel(dataset_id: string, label: string) {
        let index = this.getDatasetIndex(dataset_id)
        this.state.datasets[index].label = label
    }

    private getDatasetIndex(dataset_id: string): number {
        let index = 0
        for(let i = 0; i < this.state.datasets.length; i++)
            if(this.state.datasets[i].dataset_id === dataset_id)
                index = i
        return index
    }

    Render(ctx: HTMLCanvasElement, disableTooltip?: boolean) {
        //if(disableTooltip === true || disableTooltip === undefined)
        Chart.register(CrosshairPlugin)

        let chartStatus = Chart.getChart(ctx)
        if(chartStatus !== undefined)
            chartStatus.destroy()
        
        this.chart = new Chart(ctx as any, {
            type: 'line',
            data: this.state as any,
            options: this.options as any
        })
    }
}

export default LunarChartBuilder