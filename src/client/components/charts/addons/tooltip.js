import * as d3 from 'd3'

function SetupTooltip(opts, margin, svg) {
    const tooltip = svg.append("g")
        .attr('class', 'focus')
        .style('display', 'none')

    let height = opts['height']
    let node   = svg.node()
    
    let line = tooltip.append("line")
        .attr('class', 'hover-line')
        .attr('y1', 0)
        .attr('y2', height)

    let longestCharLength = 0
    let preMSG = ""
    if("preFormatter" in opts) {
        longestCharLength = opts['preFormatter'].length
        preMSG = opts['preFormatter']
    } else {
        longestCharLength = opts['name'].length
        preMSG = opts['name']
    }

    longestCharLength = longestCharLength + 4
    let boxHeight     = 2.5 * 30
    let boxWidth      = 15 * longestCharLength
    let fontOffset = 25 + 30

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
    let text = tooltipText.append("text")
        .text(preMSG)
        .attr('font-family', 'Inter')
        .attr('y', fontOffset)
        .attr('x', 10)
        .style('font-size', '0.7rem')

    
    //setup bisection
    let axis = opts['axis']
    let pt   = node.createSVGPoint()

    function CursorPoint(evt) {
        pt.x = evt.clientX
        pt.y = evt.clientY
        return pt.matrixTransform(node.getScreenCTM().inverse())
    }

    function Bisect(mx) {
        const bisect = d3.bisector(d => d.date).left
        const date   = axis['x'].invert(mx)
        const index  = bisect(opts['data'], date, 1)
        
        let direction = "right"
        if(opts['data'].length / 4 < index)
            direction = "left"
        return { data: opts['data'][index], direction: direction, index: index }
    }

    svg.on('mouseover', function () {
        tooltip.style("display", null);
    })

    svg.on('mouseout', function () {
        tooltip.style("display", 'none');
    })

    svg.on("touchmove mousemove", function(event) {
        const data = Bisect(d3.pointer(event)[0])
        let rx = CursorPoint(event).x

        line.attr("transform", `translate(${rx}, 0)`)
        let boxTransform = {
            x: 0,
            y: 0
        }

        if(data.direction == "right")
            boxTransform = { x: rx + 5, y: axis['y'](data.data.value) }
        if(data.direction == "left")
            boxTransform = { x: rx - (boxWidth + 5), y: axis['y'](data.data.value) }
        
        rect.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
        yTitle.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)

        if(axis['xAxisType'] == 'D')
            yTitle.text(opts['data'][data.index].date.toDateString())
        if(axis['xAxisType'] == 'Y')
            yTitle.text(opts['data'][data.index].date)

        text.attr("transform", `translate(${boxTransform.x}, ${boxTransform.y})`)
        text.text(preMSG + ": " + opts['data'][data.index].value)
    })
}

export default SetupTooltip