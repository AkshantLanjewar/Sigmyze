import React from "react"

import ChartCarousel from "./components/home-components/chart-carousel"
import FeaturedIndicators from "./components/home-components/featured-indicators"

function IndexPage(): JSX.Element {
    return (
        <main className="index-wrap">
            <ChartCarousel />

            <div className="spark-cards">
                <h2 className="subheader">Featured Indicators</h2>
                <FeaturedIndicators />
            </div>
        </main>
    )
}

export default IndexPage