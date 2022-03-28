import React, { useState } from "react"

import DatasetView from './adder-views/dataset-view'
import IndicatorView from './adder-views/indicator-view'

function ComponentModal(props) {
    const viewState           = props.viewState
    const setViewState        = props.setViewState 
    const activeIndicators    = props.activeIndicators
    const setActiveIndicators = props.setActiveIndicators

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
        setViewState(false)

        let pack = {}
        pack['iso3']     = indicator.iso3
        pack['ind3']     = indicator.indicator
        pack['fullname'] = indicator.name
        pack['category'] = indicator.category
        pack['dataset']  = dataset.name
        pack['type']     = "line"

        let t_indicators = activeIndicators
        t_indicators.push(pack)

        setActiveIndicators([...t_indicators])
        setIndicator(null)
        setDataset({ name: '', type: '' })
        setActiveView("dataset")
        setSubmitBtn(false)
        setActiveBtn(false)
    }

    return (
        <div className={`background-ts ${ viewState ? 'view' : '' }`}>
            <div className={`component-sidebar ${ viewState ? 'view' : '' }`}>
                <div className="header">
                    <h5>Select Dataset</h5>
                    <button className="close" onClick={() => { setViewState(false) }}></button>
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
        </div>
    )
}

export default ComponentModal