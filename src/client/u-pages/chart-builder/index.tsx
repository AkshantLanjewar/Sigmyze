import React from "react"

import ChartComponentsViewer, { ChartTabs } from './components/chart-components'
import ChartNavbar from "./components/chart-nav"
import OverviewChart from './components/chart'

function ChartBuilderPage() {
    return (
        <div className="chart-builder">
            <ChartNavbar />

            <div className="root">
                <ChartComponentsViewer />
                
                <div className="content">
                    <ChartTabs />
                    <OverviewChart />
                </div>
            </div>
        </div>
    )
}

export default ChartBuilderPage