import React, { useState } from "react"

import DatasetView from './adder-views/dataset-view'
import IndicatorView from './adder-views/indicator-view'

function ComponentModal(props) {
    const [activeBtn, setActiveBtn] = useState(false)
    const [activeView, setActiveView] = useState("indicator")

    let view = null
    if(activeView == "dataset")
        view = <DatasetView setActiveBtn={setActiveBtn} />
    if(activeView == "indicator")
        view = <IndicatorView dataset={"WEO"} />

    return (
        <div className="component-sidebar">
            <div className="header">
                <h5>Select Dataset</h5>
                <button className="close"></button>
            </div>

            <div className="body">
                {view}
            </div>

            <div className="footer">
                <button className={`${activeBtn ? 'primary' : ''}`}>Continue</button>
            </div>
        </div>
    )
}

export default ComponentModal