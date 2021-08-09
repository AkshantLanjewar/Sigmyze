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

    const [state, setState] = useState({ geoData: {}, scale: null })

    let [geojsonLayer, setgeojsonLayer] = useState(null)

    useEffect(() => {
        const url = "/api/data/map/gdp_growth"

        fetch(url)
            .then(response => response.json())
            .then(data => {
                //create the scale
                let colorscale = d3.scaleSequential(d3.interpolatePlasma).domain([data["minGrowth"], data["maxGrowth"]])
                setState({...state, geoData: geojsonLayer["geo"], scale: colorscale})
                setgeojsonLayer(new GeoJsonLayer({
                    id: 'gdp_growth_json',
                    data: state.geoData,
                    opacity: 0.8,
                    stroked: false,
                    filled: true,
                    extruded: false,
                    wireframe: true,
                    getFillColor: f => state.scale(f.properties.growth),
                    pickable: false
                }))
            })
    }, []) 

    return (
        <section className="home-map">
            <DeckGL initialViewState={InitialViewState} 
                    controller={true}
                    layers={[geojsonLayer]}>
                <StaticMap mapStyle={BASEMAP.DARK_MATTER_NOLABELS} />
            </DeckGL>
        </section>
    )
}

export default Map