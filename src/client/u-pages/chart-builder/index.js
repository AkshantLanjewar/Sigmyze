import React, { useState } from "react"
import ChartNavbar from "./components/chart-nav"
import OverviewChart from './components/chart'
import Indicator from "../../data/indicator"
import AddModal from './components/add-modal/add-modal'

import { AiOutlineLineChart, AiOutlineEllipsis, AiOutlineBarChart } from "react-icons/ai"
import { FiChevronDown } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"
import { HiPlus } from "react-icons/hi"

function Tab() {
    const god = true
    let style = "flex"

    if(god)
        style = "none"
    return (
        <div className="tab active">
            <span className="icon">
                <AiOutlineBarChart />
            </span>
            <span className="text">Overview</span>
            <span className="close" style={{display: style}}>
                <IoMdClose />
            </span>
        </div>
    )
}

function ChartTabs() {
    return (
        <ul className="chart-tabs">
            <Tab />
        </ul>
    )
}

let colors = [
    {name: 'white', hex: '#FFFFFF'},
    {name: 'blue', hex: '#1c588c'},
    {name: 'green', hex: '#26a69a'},
    {name: 'red', hex: '#ef5350'},
    {name: 'orange', hex: '#f8a250'}
]

function ChartBuilderPage() {
    const [modalState, setModalState] = useState(false)
    const [indicators, setIndicators] = useState([])
    const [colorIndex, setColorIndex] = useState(0)

    function AddIndicator(country, indicator) {
        let iso3  = country.iso3
        let fName = country.name
        let iShort = indicator.indicator
        let indicatorF = indicator.name

        let dataPack = { iso3: iso3, fName: fName, indicator: iShort, indicatorF: indicatorF, dataIndexed: false }
        let nIndicators = indicators
        nIndicators.push(dataPack)

        let url = `/api/data/v2/datasets/WEO/${iso3}/${iShort}`
        fetch(url)
            .then(response => response.json())
            .then(async (data) => {
                await Indicator.AddIndicator(iso3, fName, iShort, indicatorF, data)
                dataPack['dataIndexed'] = true
                dataPack['color'] = colors[colorIndex]
                nIndicators[nIndicators.length - 1] = dataPack

                setIndicators([...nIndicators])
                let updateColor = colorIndex
                if(updateColor + 1 == colors.length)
                    updateColor = 0
                else
                    updateColor += 1
                setColorIndex(updateColor)
            })
    }

    return (
        <div className="chart-builder">
            <ChartNavbar />

            <div className="root">
                <AddModal modalState={modalState} setModalState={setModalState} addIndicator={AddIndicator} />
                <div className="nav">
                    <div className="section-container">
                        <div className="header">
                            <FiChevronDown className="c-icon" />
                            <h3 className="title">Indicators</h3>
                            <HiPlus className="add" onClick={() => { setModalState(true) }} />
                        </div>

                        <div className="children">
                            <div className="component-content">
                                {indicators.map((step) => {
                                    let title = `${step.iso3} - ${step.indicator}`

                                    return (
                                        <div className="component">
                                            <div className="inner">
                                                <div className="icon">
                                                    <AiOutlineLineChart />
                                                </div>

                                                <div className="text">{title}</div>

                                                <div className="actions">
                                                    <AiOutlineEllipsis />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content">
                    <ChartTabs />
                    <OverviewChart indicators={indicators} />
                </div>
            </div>
        </div>
    )
}

export default ChartBuilderPage
