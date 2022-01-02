import React, { useState, useEffect } from "react"

import { IoMdClose } from "react-icons/io"
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs"

import IndicatorLayout from './indicator-layout.js'
import CountryLayout from './country-layout.js'

function AddModal(props) {
    let modalState = props.modalState
    let setModalState = props.setModalState
    let addIndicator = props.addIndicator

    const [modalStep, setModalStep] = useState(false)
    const [nextStep, setNextStep] = useState(false)
    const [submitStep, setSubmitStep] = useState(false)


    const [country, setCountry] = useState({})
    const [indicator, setIndicator] = useState({})

    function onNextClick() { 
        if(nextStep == true)
            setModalStep(true)
    }

    function onSubmitClick(e) {
        e.preventDefault()

        addIndicator(country, indicator)
        setModalState(false)
    }

    useEffect(() => {
        if(modalState == true) {
            setCountry({})
            setIndicator({})
            setModalStep(false)
        }
    }, [modalState])

    return (
        <div style={{display: modalState ? "flex" : "none", justifyContent: "center", width: "100vw", height: "100vh", position: "absolute", top: 0}}>
            <div className="absolute-black-bg"></div>

            <div className="chart-modal">
                <div className="title">
                    <div className="text">
                        {modalStep
                            ? (<div>Economic and Market Indicators</div>)
                            : (<div>Countries</div>)
                        }
                    </div>
                    <span className="close" onClick={() => { setModalState(false) }}>
                        <IoMdClose />
                    </span>
                </div>

                {modalStep
                    ? <IndicatorLayout activeCountry={country} submitStep={setSubmitStep} setIndicatorGlobal={setIndicator} />
                    : <CountryLayout nextSubmit={setNextStep} setCountry={setCountry} />
                }

                {modalStep
                    ?  (
                        <div className="form-controller">
                            <button className="controller" onClick={() => { setModalStep(false); setNextStep(false) }}>
                                <BsFillCaretLeftFill />
                                <span>Prev</span>
                            </button>
                            <button className="controller" onClick={onSubmitClick} style={{background: submitStep ? "rgba(20, 98, 255, 0.4)" : "rgb(18, 18, 18)"}}>
                                <span>Submit</span>
                            </button>
                        </div>
                        )
                        
                    : (                        
                        <div className="form-controller">
                            <button className="controller" onClick={onNextClick} style={{background: nextStep ? "rgba(20, 98, 255, 0.4)" : "rgb(18, 18, 18)" }}>
                                <span>Next</span>
                            </button>
                        </div>
                        )
                }
            </div>
        </div>
    )
}

export default AddModal