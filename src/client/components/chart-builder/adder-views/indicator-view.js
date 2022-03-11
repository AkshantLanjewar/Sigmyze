import React, { useState, useEffect } from "react"
import IconHash from "../../icon-hash"

import { GetDatasetIndicators } from '../../../data/indicator'
import CountrySearch from "../../../pages/resources-page/components/country-search"

function Indicator(props) {
    const obj = props.indicator_obj
    if(obj == undefined)
        return null
    
    
    return (
        <div className="t-elem">
            <div className="title">
                <div className="icon">{IconHash[obj.category]}</div>
                <div className="fullname">{obj.name}</div>
            </div>

            <div className="chart">

            </div>
        </div>
    )
}

function IndicatorView(props) {
    const dataset       = props.dataset
    const activeCountry = props.activeCountry

    const [categories, setCategories] = useState([])
    const [indicators, setIndicators] = useState([])

    useEffect(() => {
        let category_url = `/api/data/v2/datasets/${dataset}/categories`
        fetch(category_url)
            .then(response => response.json())
            .then(data => {
                if(data.error && data.msg == "dataset_404") {
                    setValidSet(false)
                    return
                }

                let rCategory = []

                for(let i = 0; i < data.data.length; i++)
                    rCategory.push({dataset: data.data[i].replace(dataset, ""), active: false})
                rCategory.splice(0, 0, { dataset: 'All', active: true })
                setCategories(rCategory)
            })
    }, [])

    useEffect(() => {
        async function anon() {
            let active_category = null
            for(let i = 0; i < categories.length; i++) {
                let elem = categories[i]
                if(elem.active)
                    active_category = elem
            }

            if(active_category == null)
                return
            
            let data = await GetDatasetIndicators(dataset, activeCountry)
            setIndicators(data.indicators)
        }

        anon()        
    }, [categories])

    function SetActiveCategory(name) {
        let tList = []
        for(let i = 0; i < categories.length; i++) {
            let elem = categories[i]
            elem['active'] = false
            if(elem['dataset'] == name)
                elem['active'] = true
            
            tList.push(elem)
        }

        setCategories([...tList])
    }

    return (
        <div>
            <CountrySearch />
            <div className="pills">                
                {categories.map((step) => (
                    <span className={`pill ${step.active ? 'active' : ''}`} onClick={() => { SetActiveCategory(step.dataset) }}>
                        <span className="content">{step.dataset}</span>
                    </span>
                ))}
            </div>

            <div className="d-table">
                {indicators.map((step) => ( <Indicator indicator_obj={step} /> ))}
            </div>
        </div>
    )
}

export default IndicatorView