import React, { useState, useEffect } from "react"

function TableView(props) {
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
        <div>
        </div>
    )
}

export default TableView