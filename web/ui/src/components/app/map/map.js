import React, { useState, useEffect } from "react"
import './map.scoped.scss'

import DeckGL from "@deck.gl/react"
import { BASEMAP } from '@deck.gl/carto'

import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers'

import { StaticMap } from 'react-map-gl'

import * as d3 from 'd3'

function HexToArray(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]
}

const Map = ({  }) => {
    const InitialViewState = {
        longitude: 65.41669,
        latitude: 37.7853,
        zoom: 2,
        pitch: 0,
        bearing: 0
    }

    const [mapData, setMapData]       = useState(null)
    const [colorScale, setColorScale] = useState({ min: 0, max: 0 })
    const [mapInfo, setMapInfo]       = useState({})

    const interpolater = d3.scaleSequential(d3.interpolatePlasma).domain([colorScale.min, colorScale.max])
    const geoLayer = new GeoJsonLayer({
        id: "geomap",
        data: mapData,
        opacity: 0.8,
        stroked: true,
        visible: true,
        filled: true,
        extruded: false,
        wireframe: true,
        getElevation: (f) => 1000,
        getFillColor: (f) => {
            let growth = f.properties.growth
            if(growth != null)
                return HexToArray(interpolater(growth))
            if(growth == null)
                return [255, 255, 255]
        },
        getLineColor: [200,200,200],
        getLineWidth: 1,
        lineWidthMinPixels:1,
        pickable: true,
        onClick: info => setMapInfo(info),
        onHover: info => setMapInfo(info)
    })

    const layers = [ geoLayer ]

    return (
        <div className="map">
            <DeckGL initialViewState={InitialViewState}
                controller={true}
                layers={layers}>
                    <StaticMap mapStyle={BASEMAP.POSITRON_NOLABELS} />
            </DeckGL>
        </div>
    )
}

export default Map