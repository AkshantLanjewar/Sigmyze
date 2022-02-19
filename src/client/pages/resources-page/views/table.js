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
        <div className="body table" style={{ marginTop: "15px", width: "100%" }}>
            <h3 className="table-title"></h3>

            <div className="t-head">
                <div className="elem">Indicator Name</div>
                <div className="elem">Indicator Short</div>
                <div className="elem">Indicator Category</div>
                <div className="elem">Unit</div>
            </div>

            <div className="t-elem">

            </div>
        </div>
    )
}

export default TableView