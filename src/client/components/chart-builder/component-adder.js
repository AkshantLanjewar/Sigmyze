import React, { useState } from "react"

import DatasetView from './adder-views/dataset-view'
import IndicatorView from './adder-views/indicator-view'

function ComponentModal(props) {
    const [activeBtn, setActiveBtn] = useState(false)
    const [submitBtn, setSubmitBtn] = useState(false)
    const [activeView, setActiveView] = useState("dataset")

    const [indicator, setIndicator] = useState(null)
    const [dataset, setDataset] = useState({ name: '', type: '' })

    let view = null
    if (activeView == "dataset")
        view = <DatasetView setActiveBtn={setActiveBtn} setDataset={setDataset} />
    if (activeView == "indicator")
        view = <IndicatorView dataset={dataset.name} setIndicator={setIndicator} setSubmitBtn={setSubmitBtn} />

    function SubmitIndicator(e) {
        e.preventDefault()
        console.log(indicator)
    }

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
                {activeView == "dataset" &&
                    <button
                        onClick={() => {
                            if (activeBtn)
                                setActiveView("indicator")
                        }}
                        className={`${activeBtn ? 'primary' : ''}`}
                    >
                        Continue
                    </button>
                }

                {activeView == "indicator" &&
                    <>
                        <button className=""
                            onClick={() => {
                                setActiveView("dataset")
                            }}
                        >
                            Previous
                        </button>

                        <button
                            className={`${submitBtn ? 'primary' : ''}`}
                            onClick={SubmitIndicator}
                        >
                            Add
                        </button>
                    </>
                }
            </div>
        </div>
    )
}

export default ComponentModal