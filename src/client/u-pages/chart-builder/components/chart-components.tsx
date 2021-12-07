import React from "react";
import { AiOutlineLineChart, AiOutlineEllipsis, AiOutlineBarChart } from "react-icons/ai"
import { FiChevronDown } from "react-icons/fi"
import { IoMdClose } from "react-icons/io"
import { HiPlus } from "react-icons/hi"

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            style={{cursor: "pointer"}}
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    )
}

function AddModal() {
    return (
        <div style={{display: "flex", justifyContent: "center", width: "100vw", height: "100%", position: "absolute", top: 0}}>
            <div className="absolute-black-bg"></div>

            <div className="chart-modal">
                <div className="search-container">
                    <div className="form-container">
                        <div className="form-tab">
                            <div className="field">
                                <SearchIcon />
                                <p className="placeholder">Search Indicators</p>

                                <form>
                                <input className="text-field"  autoComplete="off" type="text" />
                            </form>
                            </div>
                            <div className="search-btn"></div>
                        </div>
                    </div>

                    <div className="result-tab">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

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
        <div>
            <AddModal />
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
        </div>
    )
}

export { ChartTabs }
export default ChartComponentsViewer