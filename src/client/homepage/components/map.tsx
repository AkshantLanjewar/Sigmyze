import React from "react"

import { StaticMap } from 'react-map-gl'
import DeckGL from "@deck.gl/react"
import { BASEMAP } from '@deck.gl/carto'

function Map() {
    const InitialViewState = {
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 13,
        pitch: 0,
        bearing: 0
    }

    return (
        <section className="home-map">
            <DeckGL initialViewState={InitialViewState} controller={true}>
                <StaticMap mapStyle={BASEMAP.DARK_MATTER_NOLABELS} />
            </DeckGL>
        </section>
    )
}

export default Map