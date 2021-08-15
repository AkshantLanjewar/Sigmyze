import React, { FunctionComponent } from "react"
import { BsChevronDown } from 'react-icons/bs'

import '../sass/sales.scss'

const Sales: FunctionComponent<{}> = ({ children }) => {
    return (
        <div className="sales-card">
            <div className="card-title-row">
                <h5 className="title">Sales over the Past Quarter</h5>

                <div className="timeframe-dropdown">
                    <div className="current-timeframe">
                        <span className="value">Quarter</span>
                        <BsChevronDown />
                    </div>

                    <div className="options">
                        <ul>
                            <li>Week</li>
                            <li>Month</li>
                            <li className="active">Quarter</li>
                            <li>Year</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card-content">
                
            </div>
        </div>
    )
}

export default Sales