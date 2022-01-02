import React, { useEffect, useState } from "react"

import { StaticMap } from 'react-map-gl'
import DeckGL from "@deck.gl/react"
import { BASEMAP } from '@deck.gl/carto'

import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers'

import * as d3 from "d3"

function Legend(props) {
    let mapName = props.mapName
    let mapDesc = props.mapDesc
    let mapMin  = props.mapMin
    let mapMax  = props.mapMax

    const svgRref = React.createRef()
    useEffect(() => {
        svgRref.current.innerHTML = ""
        let svg = d3.select(svgRref.current)

        let svgDims = svgRref.current.getBoundingClientRect()

        function ramp() {
            const color = d3.interpolatePlasma
            const canvas = document.createElement("canvas")
            canvas.width = 512
            canvas.height = 1

            const context = canvas.getContext("2d")

            canvas.style.margin = "0 -14px"
            canvas.style.width = `${svgDims.width}px`;
            canvas.style.height = "40px";
            canvas.style.imageRendering = "-moz-crisp-edges"
            canvas.style.imageRendering = "pixelated"

            for(let i = 0; i < 512; ++i) {
                context.fillStyle = color(i / (512 - 1))
                context.fillRect(i, 0, 1, 1)
            }

            return canvas
        }

        let x = d3.scaleLinear().domain([mapMin, mapMax]).range([0, svgDims.width - 1])
        let g = svg.append("g")
            .attr("transform", `translate(0, ${30})`)
        
        svg.append("image")
            .attr("preserveAspectRatio", "none")
            .attr("width", `${svgDims.width}px`)
            .attr("height", "30px")
            .attr("xlink:href", ramp().toDataURL())
        g.call(d3.axisBottom(x))
    })

    return (
        <div className="legend">
            <div className="title">
                <div>{mapName}</div>
                <div className="sub">{mapDesc}</div>
            </div>

            <div className="ramp">
                <svg ref={svgRref}></svg>
            </div>
        </div>
    )
}

function Map() {
    const InitialViewState = {
        longitude: 65.41669,
        latitude: 37.7853,
        zoom: 2,
        pitch: 0,
        bearing: 0
    }

    const [mapdata, setMapData] = useState(null)
    const [colorscale, setColorScale] = useState({min: 0, max: 0})

    function HexToArr(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]
    }

    useEffect(() => {
        const url = "/api/data/map/gdp_growth"

        fetch(url)
            .then(response => response.json())
            .then(data => {
                //create the scale
                let geojson = data["geo"]

                setColorScale({min: data["minGrowth"], max: data["maxGrowth"]})
                setMapData(geojson)
            })
    }, []) 

    const interpolater = d3.scaleSequential(d3.interpolatePlasma).domain([colorscale.min, colorscale.max])
    const geoLayer = new GeoJsonLayer({
        id: "geomap",
        data: mapdata,
        opacity: 0.8,
        stroked: false,
        visible: true,
        filled: true,
        extruded: true,
        wireframe: true,
        getElevation: (f) => 1000,
        getFillColor: (f) => {
            let growth = f.properties.growth
            if(growth != null)
                return HexToArr(interpolater(growth))
            if(growth == null)
                return [255, 255, 255]
        },
        getLineColor: [255, 255, 255],
        pickable: true
    })

    const layers = [geoLayer]

    return (
        <section className="home-map">
            <DeckGL initialViewState={InitialViewState} 
                    controller={true}
                    layers={layers}>
                <Legend
                    mapName={"Global GDP Growth"}
                    mapDesc={"from 2020 in %"}
                    mapMin={colorscale.min}
                    mapMax={colorscale.max} />
                <StaticMap mapStyle={BASEMAP.POSITRON_NOLABELS} />
            </DeckGL>
        </section>
    )
}

export default Map