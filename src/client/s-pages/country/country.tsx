import React from "react"

import Navbar from "../../components/navbar"
import CountrySearch from './components/country-search'

function IndicatorPage() {
    return (
        <div>
            <Navbar />

            <div className="container">
                <h1 className="country-title">Know your Country</h1>

                <CountrySearch />
            </div>
        </div>
    )
}

export default IndicatorPage