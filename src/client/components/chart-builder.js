import React from "react"

import * as d3 from 'd3'

export const blueColor = "#456ef7"
export const redColor  = "#F7456E"


class ChartBuilder {
    container
    charts
    axisIndex
    margin

    constructor(container) {
        this.container = container
        this.charts = []
        this.axisIndex = 0

        this.margin = {
            top: 20,
            right: 10,
            bottom: 20,
            left: 10
        }
    }


    SetAxisIndex(index) {
        this.axisIndex = index
    }

    AddLineChart(options) {
        this.charts.push(options)
    }

    //data utils
    /*
    private Normalize(min: number, max: number, val: number) {
        if(min < 0) {
            max += 0 - min
            val += 0 - min
            min = 0
        }
        val = val - min
        max = max - min
        return Math.max(0, Math.min(1, val / max))
    }*/

    //tooltip

    SetupTooltip(svg, x, y, data, height, xAxType) {

        const tooltip = svg.append('g')
            .attr('class', 'focus')
            .style('display', 'none')

        let line = tooltip.append('line')
            .attr('class', 'hover-line')
            .attr('y1', 0)
            .attr('y2', height)

        let charts = this.charts
        let chartCount = charts.length
        let yAxisCount = charts[this.axisIndex].chartData.length

        let longestCharLength = 0

        for(let i = 0; i < chartCount; i++) {
            let formatterString = charts[i].formatterPre

            if(i == 0)
                longestCharLength = formatterString.length
            if(formatterString.length > longestCharLength)
                longestCharLength = formatterString.length
        }

        longestCharLength = longestCharLength + 4
        let boxHeight  = (chartCount + 1) * 30
        if(chartCount == 1)
            boxHeight = (chartCount + 1.5) * 30
        let boxWidth   = 15 * longestCharLength

        let tooltipText = tooltip.append("g")
            .attr('class', 'tooltip-container')
            .attr('width', boxWidth)
            .attr('height', boxHeight)

        let rect = tooltipText.append('rect')
            .attr('class', 'tooltip-chart')
            .attr('width', boxWidth)
            .attr('height', boxHeight)
            .attr('rx', 3)
            .attr('ry', 3)

        let yTitle = tooltipText.append("text")
            .attr('font-family', 'Inter')
            .attr('y', 25)
            .attr('x', 10)
            .style('font-size', '0.7rem')

        let fontOffset = 25 + 30
        let textArray = []
        for(let i = 0; i < chartCount; i++) {
            let tmpText = tooltipText.append("text")
                .text("swag")
                .attr('font-family', 'Inter')
                .attr('y', fontOffset)
                .attr('x', 10)
                .style('font-size', '0.7rem')

            textArray.push(tmpText)
            fontOffset += 22
        }

        function Bisect(mx) {
            const bisect = d3.bisector(d => d.date).left
            const date = x.invert(mx)
            const index  = bisect(data, date, 1)

            let direction = "right"

            if((yAxisCount / 2) < index)
                direction = "left"
            return { data: data[index - 1], direction: direction, index: index }
        }

        svg.on('mouseover', function() {
            tooltip.style("display", null);
        })

        svg.on('mouseout', function() {
            tooltip.style("display", 'none');
        })

        svg.on("touchmove mousemove", function(event) {
            const dataObj = Bisect(d3.pointer(event)[0])
            line.attr("transform", `translate(${x(dataObj.data.date)}, 0)`)

            let boxTransform = {
                x: 0,
                y: 0
            }

            if(dataObj.direction == "right")
                boxTransform = { x: x(dataObj.data.date) + 5, y: y(dataObj.data.value) }
            else if (dataObj.direction == "left")
                boxTransform = { x: x(dataObj.data.date) - (boxWidth + 5), y: y(dataObj.data.value) }

            rect.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
            yTitle.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)

            if (xAxType=='D'){
                yTitle.text(charts[0].chartData[dataObj.index - 1].date.toDateString())
            }
            else if (xAxType=='Y') {
                yTitle.text(charts[0].chartData[dataObj.index - 1].date)
            }

            for(let i = 0; i < chartCount; i++) {
                textArray[i].attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
                textArray[i].text(charts[i].formatterPre + charts[i].chartData[dataObj.index - 1].value)
            }
        })
    }

    ScaleUTC(data, dim) {
        return d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([this.margin.left, dim - this.margin.right])
    }

    ScalePoint(data, dim) {
        return d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([this.margin.left, dim - this.margin.right])

    }

    LinearAxisFormatter(data, dimParam) {
        return d3.scaleLinear()
            .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice()
            .range([dimParam - this.margin.bottom, this.margin.top])
    }

    //chart types
    LineChart(x, y) {
        let line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))

        return line
    }

    CreateChart(tHeight) {
        if(this.charts.length == 0)
            return

        let options = this.charts[this.axisIndex]
        let svg
        if(tHeight != undefined) {
            svg = d3.select(this.container.current).append("svg")
                .attr("width", "100%")
                .attr("height", `${tHeight}px`)
                .style('overflow', 'visible')
                .style('z-index', '99')
        } else {
            svg = d3.select(this.container.current).append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .style('overflow', 'visible')
                .style('z-index', '99')
        }

        let boundingBox = svg.node()?.getBoundingClientRect()
        const rawWidth  = boundingBox?.width
        const rawHeight = boundingBox?.height - this.margin.top

        let clipPath = svg.append("defs")
            .append("clipPath")
            .attr("id", options.chartName )
            .append('rect')
            .attr("width", rawWidth)
            .attr("height", rawHeight)

        //let x: d3.ScaleTime<number, number, never>
        //let y: d3.ScaleLinear<number, number, never>

        var x, y;
        var minYr, maxYr;

        if(options.xAxisType == "Y"){
            x = this.ScaleUTC(options.chartData, rawWidth)
            minYr = 2025
            maxYr = 0
        }
        else if (options.xAxisType == 'D') {
            x = this.ScalePoint(options.chartData, rawWidth)
            minYr = Date.now()
            maxYr = 0
        }
        if(options.yAxisType == "linear")
            y = this.LinearAxisFormatter(options.chartData, rawHeight)

        let maxNum = 0
        let minNum = 0


        for(let i = 0; i < this.charts.length; i++) {
            let chartOptions = this.charts[i]

            for(let x = 0; x < chartOptions.chartData.length; x++) {
                let chartData = chartOptions.chartData[x]
                if(chartData.value > maxNum)
                    maxNum = chartData.value
                if(chartData.value < minNum)
                    minNum = chartData.value
                if(chartData.date >maxYr)
                    maxYr = chartData.date
                if(chartData.date<minYr)
                    minYr = chartData.date
            }
        }

        for(let i = 0; i < this.charts.length; i++) {
            const chartOptions = this.charts[i]

            if(chartOptions.chartType == "line") {
                let yFormatter = this.LinearAxisFormatter(chartOptions.chartData, rawHeight)

                if(options.showXAxis == 1){
                  if (options.xAxisType == 'Y'){
                      var stepValue = Math.round((maxYr-minYr)/6);
                      let tickRange =[];
                      tickRange.push(minYr);
                      for (var j=0;j<7;j++){
                        let val = tickRange[j]+stepValue;

                        if (val>=maxYr){
                          tickRange.push(maxYr);
                          break
                        }
                        else{
                          tickRange.push(val);
                        }
                      }

                      svg.append('g')
                          .attr('transform', 'translate(0,'+rawHeight+')')
                          .call(d3.axisBottom(x).tickFormat(d3.format('d')).tickValues(tickRange))
                    }
                  else if (options.xAxisType == 'D') {
                    svg.append('g')
                        .attr('transform', 'translate(0,'+rawHeight+')')
                        .call(d3.axisBottom(x))
                  }
                }


                svg.append("path")
                    .datum(chartOptions.chartData)
                    .attr("fill", "none")
                    .attr("stroke", chartOptions.chartColor)
                    .attr("stroke-width", 2)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", this.LineChart(x, yFormatter))
                    .attr("transform", `translate(0, ${this.margin.top})`)
                    .attr("clip-path", `url(#${options.chartName})`)

            }
        }

        this.SetupTooltip(svg, x, y, options.chartData, rawHeight, options.xAxisType)
    }
}

export default ChartBuilder
