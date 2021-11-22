import React from "react";
import { AiOutlineLineChart, AiOutlineEllipsis, AiOutlineBarChart } from "react-icons/ai"
import { FiChevronDown } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"
import { HiPlus } from "react-icons/hi"

function Item() {
    return (
        <div className="component">
            <div className="inner">
                <div className="icon">
                    <AiOutlineLineChart />
                </div>

                <div className="text">GDP Growth</div>

                <div className="actions">
                    <AiOutlineEllipsis />
                </div>
            </div>
        </div>
    )
}

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
    return (
        <div className="nav">
            <div className="section-container">
                <div className="header">
                    <FiChevronDown className="c-icon" />
                    <h3 className="title">Indicators</h3>
                    <HiPlus className="add" />
                </div>

                <div className="children">
                    <div className="component-content">
                        <Item />
                        <Item />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ChartTabs }
export default ChartComponentsViewer