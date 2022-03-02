import React, { useState } from 'react'

import { FaVirus } from 'react-icons/fa'

function ChartComponent() {
    const [expanded, setExpanded] = useState(false)

    function ToggleExpand(e) {
        e.preventDefault()
        setExpanded(!expanded)
    }

    return (
        <div className='chart-components'>
            <div className='component'>
                <a className={`tab ${expanded ? 'active-drop' : ''}`} onClick={ToggleExpand}>
                    <FaVirus />
                    <span className='title'>National GDP</span>
                </a>

                <div className={`comp-dropdown ${expanded ? 'active-drop' : ''}`}>
                    <a className='item'>Options</a>
                    <a className='item'>Delete</a>
                </div>
            </div>
        </div>
    )
}

function ChartComponents(props) {
    return (
        <div className='chart-builder-sNav'>
            <span className='header'>Chart Components</span>

            <ChartComponent />
        </div>
    )
}

export default ChartComponents