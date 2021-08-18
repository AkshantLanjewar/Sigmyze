import React, { useEffect, useState } from "react"

import { StaticMap } from 'react-map-gl'
import DeckGL from "@deck.gl/react"
import { BASEMAP } from '@deck.gl/carto'

import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers'

import * as d3 from "d3"


function Map() {
    const InitialViewState = {
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 2,
        pitch: 0,
        bearing: 0
    }

    const [mapdata, setMapData] = useState(null)
    const [colorscale, setColorScale] = useState({min: 0, max: 0})

    function HexToArr(hex: string) {
        var result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]
    }

    useEffect(() => {
        const url = "/api/data/map/gdp_growth"

        fetch(url)
            .then(response => response.json())
            .then(data => {
                //create the scale
                let colorscale = d3.scaleSequential(d3.interpolatePlasma).domain([data["minGrowth"], data["maxGrowth"]])
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

    console.log(geoLayer)

    const layers = [geoLayer]

    return (
        <section className="home-map">
            <DeckGL initialViewState={InitialViewState} 
                    controller={true}
                    layers={layers}>
                <StaticMap mapStyle={BASEMAP.POSITRON_NOLABELS} />
            </DeckGL>
        </section>
    )
}

export default Map