import React, { useState, useEffect } from "react"
import IconHash from "../../icon-hash"

import { GetDatasetIndicators, GetIndicatorV } from '../../../data/indicator'
import CountrySearch from "../../../pages/resources-page/components/country-search"
import CreateChart from "../../charts/lunar-charts"

function Indicator(props) {
    const obj = props.indicator_obj
    if(obj == undefined)
        return null
    const chartRef = React.createRef()

    useEffect(() => {
        chartRef.current.innerHTML = ""

        async function anon() {
            let data = await GetIndicatorV(obj['iso3'], obj['indicator'], obj['dataset'])

            let cMargin = {
                top: 5,
                bottom: 5
            }

            let chartOpts = {
                container: chartRef,
                containerHeight: 44,
                type: 'line',
                name: `${data['fullname']}-sticker`,
                dataset: 'WEO',
                data: data.data,
                tooltip: false,
                showXAxis: false,
                margin: cMargin
            }

            CreateChart(chartOpts)
        }
        anon()
    })
    
    return (
        <div className={`t-elem ${obj['active'] ? 'active' : ''}`}>
            <div className="title">
                <div className="icon">{IconHash[obj.category]}</div>
                <div className="fullname">{obj.name}</div>
            </div>

            <div className="chart" ref={chartRef}></div>
        </div>
    )
}

function IndicatorView(props) {
    const dataset       = props.dataset
    const setSubmitBtn  = props.setSubmitBtn
    const setIndicator  = props.setIndicator

    const [categories, setCategories] = useState([])
    const [indicators, setIndicators] = useState([])
    const [activeIndicator, setActiveIndicator] = useState(null)
    const [activeCountry, setActiveCountry] = useState({iso3: "USA", fullname: "United States"})

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
            
            let data = await GetDatasetIndicators(dataset, activeCountry.iso3)
            let active_indicators = []
            if(active_category.dataset == 'All') {
                active_indicators = data.indicators
                for(let i = 0; i < active_indicators.length; i++)
                    active_indicators[i]['active'] = false
            } else {
                let dataset_name = active_category.dataset
                for(let i = 0; i < data.indicators.length; i++) {
                    let indicator = data.indicators[i]
                    indicator['active'] = false

                    if(indicator.category == dataset_name)
                        active_indicators.push(indicator)
                }
            }

            setIndicators([...active_indicators])
        }

        anon()        
    }, [categories, activeCountry])

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

    function SetActiveIndicator(obj) {
        let tmp_indicators   = indicators
        let active_indicator = null
        setActiveIndicator(obj)

        for(let i = 0; i < tmp_indicators.length; i++) {
            let t_indicator = tmp_indicators[i]
            t_indicator['active'] = false

            if(t_indicator.name == obj.name && obj.indicator == t_indicator.indicator) {
                t_indicator['active'] = true
                active_indicator = t_indicator
            }
            tmp_indicators[i] = t_indicator
        }

        setIndicators([...tmp_indicators])
        setSubmitBtn(true)
        setIndicator(active_indicator)
    }

    return (
        <div>
            <CountrySearch initalFullName={activeCountry.fullname} setActiveSearch={setActiveCountry} />
            <div className="pills">                
                {categories.map((step) => (
                    <span className={`pill ${step.active ? 'active' : ''}`} onClick={() => { SetActiveCategory(step.dataset) }}>
                        <span className="content">{step.dataset}</span>
                    </span>
                ))}
            </div>

            <div className="d-table">
                {indicators.map((step) => { 
                    step['dataset'] = dataset
                    step['iso3'] = activeCountry.iso3

                    return (
                        <div onClick={() => { SetActiveIndicator(step) }}>
                            <Indicator indicator_obj={step} /> 
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default IndicatorView