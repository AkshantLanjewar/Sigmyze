import React, { useEffect } from "react"
import * as d3 from "d3"

import './sass/legend.scoped.scss'

const Legend = ({ min, max, title, small_title }) => {
    const ref = React.createRef()

    useEffect(() => {
        ref.current.innerHtml = ""
        let svg = d3.select(ref.current)
        let dim = ref.current.getBoundingClientRect()

        function ramp() {
            const color  = d3.interpolatePlasma
        
            const canvas  = document.createElement("canvas")
            canvas.width  = 512
            canvas.height = 1
            
            const context = canvas.getContext("2d")
            canvas.style.margin = "0 -14px"
            canvas.style.width = `${dim.width}px`;
            canvas.style.height = "40px";
            canvas.style.imageRendering = "-moz-crisp-edges"
            canvas.style.imageRendering = "pixelated"

            for(let i = 0; i < 512; ++i) {
                context.fillStyle = color(i / (512 - 1))
                context.fillRect(i, 0, 1, 1)
            }

            return canvas
        }

        let x = d3.scaleLinear().domain([min, max]).range([0, dim.width - 1])
        let g = svg.append("g")
            .attr("transform", `translate(0, ${30})`)

        svg.append("image")
            .attr("preserveAspectRatio", "none")
            .attr("width", `${dim.width}px`)
            .attr("height", "30px")
            .attr("xlink:href", ramp().toDataURL())
        g.call(d3.axisBottom(x))
    }, [])

    return (
        <div className="legend">
            <div className="title">
                <div>{title}</div>
                <div className="sub">{small_title}</div>
            </div>

            <div className="ramp">
                <svg ref={ref} />
            </div>
        </div>
    )
}

export default Legend