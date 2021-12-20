import React, { useState } from "react";
import { AiOutlineLineChart, AiOutlineEllipsis, AiOutlineBarChart } from "react-icons/ai"
import { FiChevronDown } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"
import { HiPlus } from "react-icons/hi"
import AddModal from './add-modal/add-modal.tsx'

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

function ChartComponentsViewer() {
    const [modalState, setModalState] = useState(false)
    const [indicators, setIndicators] = useState([])

    function AddIndicator(country, indicator) {
        let iso3  = country.iso3
        let fName = country.name
        let iShort = indicator.indicator
        let indicatorF = indicator.name

        let package = { iso3: iso3, fName: fName, indicator: iShort, indicatorF: indicatorF }
        let nIndicators = indicators
        nIndicators.push(package)
        setIndicators([...nIndicators])

        
    }

    return (
        <div>
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
        </div>
    )
}

export { ChartTabs }
export default ChartComponentsViewer