import React from "react"


import DeckGL from "@deck.gl/react"

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
            <DeckGL initialViewState={InitialViewState} controller={true} />
        </section>
    )
}

export default Map