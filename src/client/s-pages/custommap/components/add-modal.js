import React, { useState, useEffect } from "react"

import { IoMdClose } from "react-icons/io"
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs"

import IndicatorList from './indicator-list.js'


function AddModal(props) {
    let modalState = props.modalState
    let setModalState = props.setModalState
    let addIndicator = props.addIndicator

    //const [modalStep, setModalStep] = useState(false)
    //const [nextStep, setNextStep] = useState(false)
    const [submitStep, setSubmitStep] = useState(false)

    const [indicator, setIndicator] = useState({})

    function onSubmitClick(e) {
        e.preventDefault()

        addIndicator(indicator)
        setModalState(false)
    }

    useEffect(() => {
        if(modalState == true) {
            setIndicator({})
        }
    }, [modalState])

    return (
        <div style={{display: modalState ? "block" : "none"}}>
            <div className="absolute-black-bg"></div>
              <div className="map-modal">
                  <div className="title">
                      Select Indicator
                  </div>
                  <div className="close" onClick={() => { setModalState(false) }}>
                      <IoMdClose />
                  </div>

                  <IndicatorList submitStep={setSubmitStep} setIndicatorGlobal={setIndicator} />
                  <div className="form-controller">
                      <button className="controller" onClick={onSubmitClick} style={{background: submitStep ? "rgba(20, 98, 255, 0.4)" : "rgb(18, 18, 18)"}}>
                          <span>Submit</span>
                      </button>
                  </div>
              </div>
            
        </div>
    )
}

export default AddModal
