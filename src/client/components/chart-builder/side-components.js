import React, { useState, useEffect } from 'react'

import IconHash from '../icon-hash'
import * as getCountryISO2 from "country-iso-3-to-2"

function ChartComponent(props) {
    const indicator        = props.indicator
    const DeleteIndicators = props.DeleteIndicators
    const [expanded, setExpanded] = useState(false)

    function ToggleExpand(e) {
        e.preventDefault()
        setExpanded(!expanded)
    }

    function DeleteItem() {
        const iso3    = indicator.iso3
        const ind3    = indicator.indicator
        const dataset = indicator.dataset

        DeleteIndicators(iso3, ind3, dataset)
    }

    return (
        <div className='chart-components'>
            <div className='component'>
                <div className='tooltip-bottom' data-tooltip={`${indicator.fullname} [${indicator.indicator}]`}>
                    <a className={`tab ${expanded ? 'active-drop' : ''}`} onClick={ToggleExpand}>
                        {IconHash[indicator.category]}
                        <span className='title'>{indicator.fullname}</span>
                    </a>
                </div>

                <div className={`comp-dropdown ${expanded ? 'active-drop' : ''}`}>
                    <a className='item' onClick={DeleteItem}>Delete</a>
                </div>
            </div>
        </div>
    )
}

function CountryDivider(props) {
    const dividers                  = props.dividers
    const DeleteIndicators          = props.DeleteIndicators
    const regionNamesInEnglish      = new Intl.DisplayNames(['en'], { type: 'region' })
    const [countries, setCountries] = useState([])

    useEffect(() => {
        let t_countries = []
        for(let i = 0; i < dividers.length; i++) {
            const divider = dividers[i]
            let pack      = {}

            let iso3     = divider.country
            let iso2     = getCountryISO2(iso3)
            let fullname = regionNamesInEnglish.of(iso2)

            pack['img_url']    = `/country/${iso2.toLowerCase()}.svg`
            pack['fullname']   = fullname
            pack['indicators'] = divider.indicators
            pack['index']      = i
            pack['expanded']   = false

            t_countries.push(pack)
        }

        setCountries([...t_countries])
    }, [dividers])

    function ExpandComponent(e, index) {
        e.preventDefault()
        
        let t_countries           = countries
        countries[index].expanded = !countries[index].expanded
        setCountries([...t_countries])
    }

    return (
        <div className='chart-components'>
            {countries.map((step) => (
                <div className='component'>
                    <a className={`tab ${step.expanded ? 'active-drop' : ''}`} onClick={(e) => ExpandComponent(e, step.index)}>
                        <img src={step.img_url} width={"16px"} height={"16px"} />
                        <span className='title'>{step.fullname}</span>
                    </a>

                    <div className={`comp-dropdown ${step.expanded ? 'active-drop' : ''}`}>
                        {step.indicators.map((indicator_step) => (
                            <ChartComponent indicator={indicator_step} DeleteIndicators={DeleteIndicators} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function ChartComponents(props) {
    const activeIndicators      = props.activeIndicators
    const DeleteIndicators      = props.deleteIndicators
    const [divider, setDivider] = useState([])

    useEffect(() => {
        let country_list = []
        let iso3_list    = []

        for(let i = 0; i < activeIndicators.length; i++) {
            let indicator = activeIndicators[i]

            let country   = indicator.iso3
            let ind3      = indicator.ind3
            let dataset   = indicator.dataset
            let fullname  = indicator.fullname
            let category  = indicator.category

            if(iso3_list.includes(country)) {
                let country_index = 0
                for(let x = 0; x < country_list.length; x++) {
                    let country = country_list[x]
                    if(country.country == country)
                        country_index = x
                }

                let country_pack = country_list[country_index]
                country_pack.indicators.push({
                    dataset: dataset,
                    indicator: ind3,
                    fullname: fullname,
                    category: category,
                    iso3: country
                })
                country_list[country_index] = country_pack
            } else {
                let pack = {}
                pack['country'] = country
                pack['indicators'] = [{
                    dataset: dataset,
                    indicator: ind3,
                    fullname: fullname,
                    category: category,
                    iso3: country
                }]

                country_list.push(pack)
                iso3_list.push(country)
            }
        }

        setDivider(country_list)
    }, [activeIndicators])

    return (
        <div className='chart-builder-sNav'>
            <span className='header'>Chart Components</span>

            <CountryDivider dividers={divider} DeleteIndicators={DeleteIndicators}  />
        </div>
    )
}

export default ChartComponents