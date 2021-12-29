import React, { useState, useEffect } from "react"

import Navbar from "../../components/navbar"
import CountrySearch from './components/country-search'
import SingleCategoryCard from './components/s-category-card'

import { AiOutlineLineChart } from 'react-icons/ai'
import { GiMoneyStack } from 'react-icons/gi'
import { GiTrade } from 'react-icons/gi'
import { RiGovernmentLine } from 'react-icons/ri'
import { IoIosPeople } from 'react-icons/io'

function IndicatorPage() {
    const initialTabState = [{
        icon: <AiOutlineLineChart />,
        name: "GDP",
        short: "GDP",
        active: true
    }, {
        icon: <RiGovernmentLine />,
        name: "Govt. Finance",
        short: "GOVT",
        active: false
    }, {
        icon: <GiMoneyStack />,
        name: "Investment",
        short: "INVEST",
        active: false
    },{
        icon: <GiTrade />,
        name: "Trade",
        short: "TRADE",
        active: false
    },{
        icon: <IoIosPeople />,
        name: "People",
        short: "PEOPLE",
        active: false
    }

  ]

    const [tabsState, setTabsState] = useState(initialTabState)
    const [activeCountry, setActiveCountry] = useState({iso3: "USA", fullname: "United States"})
    const [activeTab, setActiveTab] = useState({ icon: <AiOutlineLineChart />, name: "Economics", short: "GDP", active: true })
    const [activeCharts, setActiveCharts] = useState([])

    function onTabClick(e: any, name: string) {
        e.preventDefault()
        name = name.toLowerCase()
        let newTabList = []
        let activeTab = null

        for(let i = 0; i < initialTabState.length; i++) {
            let tab = initialTabState[i]
            let tabName = tab.name.toLowerCase()

            if(tabName == name) {
                tab.active = true
                activeTab = tab
            }
            else
                tab.active = false
            newTabList.push(tab)
        }

        setTabsState(newTabList)
        setActiveTab(activeTab!)
    }

    useEffect(() => {
        if(activeCountry.iso3 == null)
            return
        const initalCategoryURL = `/api/data/categories/${activeTab.short}`
        fetch(initalCategoryURL)
            .then(response => response.json())
            .then(data => {
                let nCharts = []

                for(let i = 0; i < data.length; i++) {
                    let category = data[i]
                    nCharts.push({category: category, iso3: activeCountry.iso3})
                }

                setActiveCharts(nCharts)
            })
    }, [activeTab, activeCountry])

    return (
        <div>
            <Navbar />

            <div className="container">
                <h1 className="country-title">Know your Country</h1>

                <CountrySearch initalFullName={activeCountry.fullname} setActiveSearch={setActiveCountry} />
                <div className="tab-container">
                    <div className="tabs">
                        <ul>
                            {tabsState.map((tab) => {
                                let classSTR = ""
                                if(tab.active)
                                    classSTR = "active"

                                return (
                                    <li onClick={(e) => {onTabClick(e, tab.name)}}>
                                        <a className={classSTR}>
                                            <span>{tab.icon}</span>
                                            <span>{tab.name}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="content">
                        {activeCharts.map((chart) => {
                            return <SingleCategoryCard category={chart.category} iso3={chart.iso3} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndicatorPage
