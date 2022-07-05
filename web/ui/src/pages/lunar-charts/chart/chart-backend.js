import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"

import LunarTheme from "./theme"

/*
    BUILD CHART COMPONENT
    [description] -> creates a am5 chart scaffold
*/

function BuildChart(theme) {
    let root = am5.Root.new("main-chart")
    root.setThemes([ LunarTheme.new(root) ])

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        wheelY: "zoomX",
        maxTooltipDistance: 0
    }))

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
            opposite: true
        }),
        tooltip: am5.Tooltip.new(root, {})
    }))

    yAxis.get("renderer").labels.template.setAll({
        paddingLeft: 15
    })

    yAxis.get("tooltip").get("background").set("fill", "black")

    let xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            baseInterval: {
                timeUnit: "year",
                count: 1
            },
            tooltip: am5.Tooltip.new(root, {  })
        })
    )

    xAxis.get("tooltip").get("background").set("opacity", 1)
    xAxis.get("tooltip").get("background").set("fill", "black")
    xAxis.get("tooltip").label.setAll({
        paddingLeft: 10,
        paddingRight: 10
    })

    xAxis.get("tooltip").set("paddingTop", 5)
    xAxis.get("tooltip").set("x", 0)
    xAxis.get("tooltip").set("opacity", 1)
    xAxis.get("tooltip").set("tooltipX", 0)

    chart.set("background", am5.Rectangle.new(root, {
        fill: am5.color(theme.colors.dark[9]),
        fillOpacity: 1
    }))

    chart.set("paddingLeft", 0)
    chart.set("paddingTop", 0)
    chart.set("paddingBottom", 10)
    chart.set("paddingRight", 5)

    chart.plotContainer.set("background", am5.Rectangle.new(root, {
        fill: am5.color(theme.colors.dark[8]),
        fillOpacity: 1,
        width: "100%"
    }))

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        yAxis: yAxis,
        xAxis: xAxis
    }))

    cursor.lineX.set("stroke", theme.colors.dark[2])
    cursor.lineX.set("strokeWidth", 2)
    cursor.lineX.set("strokeDasharray", 5)
    cursor.lineY.set("stroke", theme.colors.dark[2])
    cursor.lineY.set("strokeWidth", 2)
    cursor.lineY.set("strokeDasharray", 5)

    return { root: root, chart: chart, xAxis: xAxis, yAxis: yAxis }
}

function ProcessData(uni) {
    let datas = []

    for(let i = 0; i < uni.length; i++) {
        let data = uni[i]
        

        let date = new Date(data['year'])
        date.setDate(date.getDate() + 1)
        data['date'] = date.getTime()

        datas.push(data)
    }

    return datas
}

export { ProcessData } 
export default BuildChart