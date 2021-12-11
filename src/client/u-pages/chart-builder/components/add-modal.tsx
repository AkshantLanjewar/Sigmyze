import React, { useState, useEffect } from "react"

import { IoMdClose } from "react-icons/io"
import { FcAreaChart } from "react-icons/fc"
import { FaGlobeAmericas, FaGlobeEurope, FaGlobeAfrica, FaGlobeAsia } from 'react-icons/fa'
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs"
import { AiOutlineLineChart } from "react-icons/ai"

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

type CountryLayoutProps = {
    nextSubmit: Function
}

const CountryLayout: React.FC<CountryLayoutProps> = ({nextSubmit}) => {
    const inputRef = React.createRef<HTMLInputElement>()
    const [currentCountryStep, setCurrentCountryStep] = useState(stepOneChoices)
    const [displayCountryStep, setDisplayCountryStep] = useState(stepOneChoices)
    const [displayRefs, setDisplayRefs] = useState([])
    const [activeCountry, setActiveCountry] = useState({})

    useEffect(() => {
        let url = "/api/data/countries"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let step = []

                for(let i = 0; i < data.length; i++) {
                    let country = data[i]
                    let img = <img src={`/country/${country.iso2.toLowerCase()}.svg`} width="16px" height="16px" />

                    step.push({icon: img, name: country.name, iso3: country.iso3, refIndex: i, focus: ""})
                }

                setCurrentCountryStep(step)
                setDisplayCountryStep(step)
            })
    }, [])

    function onKeyUpInput(e: any) {
        e.preventDefault()
        let currentInput = inputRef.current!.value.toLowerCase()

        let step = []
        for(let i = 0; i < currentCountryStep.length; i++) {
            const lastWord = currentInput.split(" ")[currentInput.split(" ").length - 1]
            let nStep = currentCountryStep[i]
            let sub = nStep.name.substring(0, lastWord.length).toLowerCase()

            if(lastWord == sub)
                step.push(nStep)
        }

        setDisplayCountryStep(step)
    }

    function onListClick(id: string) {
        let currentCountryT = currentCountryStep
        let displayCountryT = displayCountryStep
        for(let i = 0; i < currentCountryT.length; i++) {
            let country = currentCountryT[i]
            country.focus = ""

            if(country.iso3 == id)
                country.focus = "focus"
            currentCountryT[i] = country
        }

        for(let i = 0; i < displayCountryT.length; i++) {
            let country = displayCountryT[i]
            country.focus = ""

            if(country.iso3 == id)
                country.focus = "focus"
                displayCountryT[i] = country
        }

        setCurrentCountryStep([...currentCountryT])
        setDisplayCountryStep([...displayCountryT])
        nextSubmit(true)
    }

    return (
        <div>
            <div className="search-bar">
                <div className="input-container">
                    <input type="text" autoComplete="off" placeholder="Search" ref={inputRef} onKeyUp={onKeyUpInput} />
                </div>
                <span className="search">
                    <SearchIcon />
                </span>
            </div>

            <div className="main-wrap">
                <div className="indicator-content">
                    <div className="pills">
                    </div>

                    <div className="indicators">
                        <div className="listContainer">
                            <div className="title-item">
                                <h3>Countries</h3>
                            </div>

                            {displayCountryStep.map((step) => (
                                <div className={"indicator " + step.focus} onClick={(e) => { onListClick(step.iso3) }}>
                                    <div className="main-content">
                                        <span className="indicator-icon">{step.icon}</span>
                                        <span className="indicator-title">{step.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function IndicatorLayout() {
    return (
        <div className="main-wrap">
            <div className="side">
                <div className="tab">
                    <span className="icon"><FcAreaChart /></span>

                    <span className="tab-title">
                        <span className="text">WEO Economic</span>
                    </span>
                </div>
            </div>

            <div className="indicator-content">
                <div className="pills">
                    <span className="pill">
                        <span className="content">GDP</span>
                    </span>

                    <span className="pill">
                        <span className="content">Government</span>
                    </span>

                    <span className="pill">
                        <span className="content">Investment</span>
                    </span>
                </div>

                <div className="indicators">
                    <div className="listContainer">
                        <div className="title-item">
                            <h3>Indicators</h3>
                        </div>

                        <div className="indicator">
                            <div className="main-content">
                                <span className="indicator-title">Account Balance (USD)</span>
                            </div>

                            <div className="actions">
                                
                            </div>
                        </div>

                        <div className="indicator">
                            <div className="main-content">
                                <span className="indicator-title">Account Balance (USD)</span>
                            </div>

                            <div className="actions">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const stepOneChoices = [{icon: <AiOutlineLineChart />, name: "Internet Not Loading", iso3: "USA"}]

function AddModal() {
    const [modalStep, setModalStep] = useState(false)
    const [nextStep, setNextStep] = useState(false)

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
                    ? <IndicatorLayout />
                    : <CountryLayout nextSubmit={setNextStep} />
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