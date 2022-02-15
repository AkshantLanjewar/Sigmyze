import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import CountrySearch from './components/country-search'
import ChartCard from './components/chart-card'
import IconHash from '../../components/icon-hash'

import { CgMenuGridO } from 'react-icons/cg'
import { BsListUl } from 'react-icons/bs'

function DatasetPage() {
    let { dataset } = useParams()
    dataset = dataset.toUpperCase()

    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState({ dataset: null, active: true })
    const [activeCountry, setActiveCountry] = useState({iso3: "USA", fullname: "United States"})
    const [activeCharts, setActiveCharts] = useState([])

    useEffect(() => {
        let category_url = `/api/data/v2/datasets/${dataset}/categories`
        fetch(category_url)
            .then(response => response.json())
            .then(data => {
                let rCategory = []
                for(let i = 0; i < data.length; i++)
                    rCategory.push({dataset: data[i].replace(dataset, ""), active: false})
                rCategory[0].active = true
                setCategories([...rCategory])
                setActiveCategory({...rCategory[0]})
            })
    }, [])

    useEffect(() => {
        if(activeCategory.dataset == null)
            return

        let url = `/api/data/v2/datasets/${dataset}/groups/${dataset + activeCategory.dataset}`    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let nCharts = []

                for(let i = 0; i < data.length; i++)
                    nCharts.push({ category: data[i].indicator, iso3: activeCountry.iso3 })
                setActiveCharts(nCharts)
            })
    }, [activeCountry, categories, activeCategory])

    function SetTab(tabname) {
        let tCategories = categories
        let fCategory   = null

        for(let i = 0; i < tCategories.length; i++) {
            tCategories[i].active = false
            if(tCategories[i].dataset == tabname) {
                tCategories[i].active = true
                fCategory = tCategories[i]
            }
        }

        setCategories([...tCategories])
        setActiveCategory({...fCategory})
    }

    return (
        <div className="datasets" style={{height: "100%"}}>
            <div className='inner'>
                <div className='header'>
                    <div className='title'>
                        <h1>World Economic Outlook</h1>
                        <h5>WEO</h5>
                    </div>

                    <CountrySearch initalFullName={activeCountry.fullname} setActiveSearch={setActiveCountry} />

                    <div className='tab-container' style={{marginTop: "-1em"}}>
                        <div className='tabs' style={{ justifySelf: "center" }}>
                            <ul>
                                {categories.map((step) => (
                                    <li>
                                        <a className={step.active ? 'active' : ''} onClick={() => { SetTab(step.dataset) }}>
                                            <span>{IconHash[step.dataset]}</span>
                                            <span>{step.dataset}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='body' style={{ paddingBottom: "2rem" }}>
                    <div className='tab-container' style={{ justifyContent: "flex-end", width: "95%", marginBottom: "1rem" }}>
                        <div className='tabs'>
                            <ul>
                                <li>
                                    <a className='active'>
                                        <span><CgMenuGridO /></span>
                                    </a>
                                </li>

                                <li>
                                    <a className=''>
                                        <span><BsListUl /></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {activeCharts.map((step) => ( <ChartCard indicator={step.category} iso3={step.iso3} /> ))}
                </div>
            </div>
        </div>
    )
}

export default DatasetPage