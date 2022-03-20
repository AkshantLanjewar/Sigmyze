import * as d3 from "d3"

function LargeTooltip(opts, margin, svg) {
    let sX  = d => d.date
    const X = d3.map(opts['data'], sX)

    const tooltip = svg.append("g")
        .attr('class', 'focus')
        .style('display', 'none')

    let height = opts['height']
    let width  = opts['width']
    let node   = svg.node()

    let vLine = tooltip.append("line")
        .attr('class', 'hover-line')
        .attr('y1', 0)
        .attr('y2', height)

    let hLine = tooltip.append("line")
        .attr('class', 'hover-line')
        .attr('x1', width)
        .attr('x2', 0)

    let axis = opts['axis']
    let pt   = node.createSVGPoint()

    function CursorPoint(evt) {
        pt.x = evt.clientX
        pt.y = evt.clientY
        return pt.matrixTransform(node.getScreenCTM().inverse())
    }

    function Bisect(mx) {
        const date   = axis['x'].invert(mx)
        const index  = d3.bisectCenter(X, date)
        
        return { data: opts['data'][index], index: index }
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
        let ry = CursorPoint(event).y

        opts['setCursorPos']({ x: rx, y: ry })

        vLine.attr('transform', `translate(${opts['axis']['x'](data.data.date)}, 0)`)
        hLine.attr('transform', `translate(0, ${ry})`)
    })
}

export default LargeTooltip