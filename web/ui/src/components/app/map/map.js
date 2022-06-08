import React, { useState, useEffect } from "react"
import './sass/map.scoped.scss'

import DeckGL from "@deck.gl/react"
import { BASEMAP } from '@deck.gl/carto'

import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers'

import { StaticMap } from 'react-map-gl'
import Legend from "./legend"

import * as d3 from 'd3'

import { GetGeojsonTiles, GetMapData, SpliceMapData } from './map-data'

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

    useEffect(() => {
        async function main() {
            let tiles  = await GetGeojsonTiles()
            let m_data = await GetMapData("weo", "NGDP_RPCH")

            let min = 0
            let max = 0
            for(let i = 0; i < m_data.length; i++) {
                let data = m_data[i]
                let val  = data['VAL']

                if(min == 0)
                    min = val
                if(max == 0)
                    max = val
                if(val < min)
                    min = val
                if(val > max)
                    max = val
            }
            
            tiles = SpliceMapData(m_data, tiles)
            setColorScale({ min: min, max: max })
            setMapData(tiles)
        }
        
        main()
    }, [])

    let interpolater = d3.scaleSequential(d3.interpolatePlasma).domain([colorScale.min, colorScale.max])
    let geoLayer = new GeoJsonLayer({
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
            let growth = f.properties.data

            if(growth != null)
                return HexToArray(interpolater(growth))
            if(growth == null)
                return [0, 0, 0]
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
            <div className="inner">
                <DeckGL 
                    initialViewState={InitialViewState}
                    controller={true}
                    layers={layers}
                >
                    <Legend
                        min={colorScale.min}
                        max={colorScale.max}
                        title={"GDP Growth"}
                        small_title={"NGDP_RPCH"}
                    />
                    <StaticMap mapStyle={BASEMAP.DARK_MATTER_NOLABELS} />
                </DeckGL>
            </div>
        </div>
    )
}

export default Map