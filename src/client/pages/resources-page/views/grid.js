import React, { useState, useEffect } from "react"
import ChartCard from '../components/chart-card'

function GridVeiw(props) {
    let dataset        = props.dataset
    let activeCategory = props.activeCategory
    let activeCountry  = props.activeCountry

    const [activeCharts, setActiveCharts] = useState([])

    useEffect(() => {
        if(activeCategory.dataset == null)
            return

        let url = `/api/data/v2/datasets/${dataset}/groups/${dataset + activeCategory.dataset}`    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let nCharts = []

                for(let i = 0; i < data.data.length; i++)
                    nCharts.push({ category: data.data[i].indicator, iso3: activeCountry.iso3 })
                setActiveCharts(nCharts)
            })
    }, [activeCategory, activeCountry])

    return (
        <div className="body" style={{ marginTop: "15px", width: "100%" }}>
            {activeCharts.map((step) => ( <ChartCard indicator={step.category} iso3={step.iso3} /> ))}
        </div>
    )
}

export default GridVeiw