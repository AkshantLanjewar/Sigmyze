import React from "react"

import { BiPlus, BiStar } from 'react-icons/bi'

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
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

function CreateProject() {
    return (
        <div>
            <div className="search-bar">
                <div className="input-container">
                    <input type="text" autoComplete="off" placeholder="Search" />
                </div>
                <span className="search">
                    <SearchIcon />
                </span>
            </div>

            <div className="main-wrap">
                <div className="side">
                    <div className="tab">
                        <span className="icon"><BiPlus /></span>

                        <span className="tab-title">
                            <span className="text">Create Project</span>
                        </span>
                    </div>

                    <div className="tab">
                        <span className="icon"><BiStar /></span>

                        <span className="tab-title">
                            <span className="text">Browse Templates</span>
                        </span>
                    </div>
                </div>

                <div className="indicator-content">

                </div>
            </div>

            <div className="form-controller">
                <button className="controller">
                    <span>Next</span>
                </button>
            </div>
        </div>
    )
}

export default CreateProject