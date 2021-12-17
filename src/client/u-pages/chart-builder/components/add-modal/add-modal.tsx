import React, { useState, useEffect } from "react"

import { IoMdClose } from "react-icons/io"
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs"

import IndicatorLayout from './indicator-layout.tsx'
import CountryLayout from './country-layout.tsx'

function AddModal() {
    const [modalStep, setModalStep] = useState(false)
    const [nextStep, setNextStep] = useState(false)
    const [country, setCountry] = useState({})

    return (
        <div style={{display: "flex", justifyContent: "center", width: "100vw", height: "100%", position: "absolute", top: 0}}>
            <div className="absolute-black-bg"></div>

            <div className="chart-modal">
                <div className="title">
                    <div className="text">
                        {modalStep
                            ? (<div>Economic and Market Indicators</div>)
                            : (<div>Countries</div>)
                        }
                    </div>
                    <span className="close">
                        <IoMdClose />
                    </span>
                </div>

                {modalStep
                    ? <IndicatorLayout activeCountry={country} />
                    : <CountryLayout nextSubmit={setNextStep} setCountry={setCountry} />
                }

                {modalStep
                    ?  (
                        <div className="form-controller">
                            <button className="controller" onClick={() => {setModalStep(false)}}>
                                <BsFillCaretLeftFill />
                                <span>Prev</span>
                            </button>
                            <button className="controller">
                                <span>Submit</span>
                            </button>
                        </div>
                        )
                        
                    : (                        
                        <div className="form-controller">
                            <button className="controller" onClick={() => {
                                if(nextStep == true)
                                    setModalStep(true)
                            }} style={{background: nextStep ? "rgba(20, 98, 255, 0.4)" : "rgb(18, 18, 18)" }}>
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