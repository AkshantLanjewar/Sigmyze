import React, { useState, useEffect } from "react"

import { GetIndicatorV } from "../../../data/indicator"

function TableElem(props) {
    let dataset = props.dataset
    let iso3 = props.iso3
    let ind3 = props.ind3

    const setActiveIndicator = props.setActiveIndicator
    const setModalState      = props.setModalState

    const [indicatorData, setIndicatorData] = useState({ fName: null, unit: null })
    const [display, setDisplay] = useState(true)

    useEffect(() => {
        async function anon() {
            let pack = await GetIndicatorV(iso3, ind3, dataset)
            setIndicatorData({
                fName: pack['fullname'],
                unit: pack['units'] 
            })

            if(pack['data'] == undefined)
                setDisplay(false)
            if(pack['data'].length == 0)
                setDisplay(false)
        }

        anon()
    })

    return (
        <div 
            className="t-elem" 
            style={{ display: display ? "flex" : "none" }}
            onClick={() => { setModalState(true); setActiveIndicator(ind3); }}>
                <div className="elem fName">{indicatorData.fName}</div>
                <div className="elem sName">{ind3}</div>
                <div className="elem unit">{indicatorData.unit}</div>
        </div>
    )
}

function TableView(props) {
    let dataset        = props.dataset
    let activeCategory = props.activeCategory
    let activeCountry  = props.activeCountry

    const setModalState      = props.setModalState
    const setActiveIndicator = props.setActiveIndicator

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
                <div className="elem fName">Indicator Name</div>
                <div className="elem sName">Indicator Short</div>
                <div className="elem unit">Unit</div>
            </div>

            {activeCharts.map((step) => ( 
                <TableElem 
                    iso3={step.iso3} 
                    ind3={step.category} 
                    dataset={dataset} 
                    setModalState={setModalState} 
                    setActiveIndicator={setActiveIndicator}/> 
            ))}
        </div>
    )
}

export default TableView