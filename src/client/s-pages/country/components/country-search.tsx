import React, { useState, useEffect } from "react"

import { AiOutlineLineChart } from 'react-icons/ai'

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
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

function capitalize(s: string)
{
    return s[0].toUpperCase() + s.slice(1);
}

const stepOneChoices = [{icon: <AiOutlineLineChart />, name: "Internet Not Loading", iso3: "USA"}]

type props = {
    initalFullName: string,
    setActiveSearch: Function
}

const CountrySearch: React.FC<props> = ({ initalFullName, setActiveSearch }) => {
    const placeholderRef = React.createRef<HTMLDivElement>()
    const resultTabRef = React.createRef<HTMLDivElement>()
    const inputRef = React.createRef<HTMLInputElement>()
    let [currentStep, setCurrentStep] = useState(stepOneChoices)
    let [displayStep, setDisplayStep] = useState(stepOneChoices)

    function onFocus() {
        if(inputRef.current!.value == "")
            placeholderRef.current!.style.opacity = "0"
        resultTabRef.current!.classList.add("active-search")
        inputRef.current!.value = ""
    }

    function onBlur() {
        if(inputRef.current!.value == "")
            placeholderRef.current!.style.opacity = "1"

        resultTabRef.current!.classList.remove("active-search")
    }

    useEffect(() => {
        if(initalFullName != "")
            placeholderRef.current!.style.opacity = "0"

        let url = "/api/data/countries"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let stepTwo = []

                for(let i = 0; i < data.length; i++) {
                    let country = data[i]
                    let img = <img src={`/country/${country.iso2}.svg`} width="16px" height="16px" />
                    stepTwo.push({icon: img, name: country.name, iso3: country.iso3})
                }

                setCurrentStep(stepTwo)
                setDisplayStep(stepTwo)
            })
    }, [])

    function onKeyUpInput(e: any) {
        e.preventDefault()
        let currentInput = inputRef.current!.value.toLowerCase()

        let nStep = []
        for(let i = 0; i < currentStep.length; i++) {
            const lastWord = currentInput.split(" ")[currentInput.split(" ").length - 1]
            let step = currentStep[i]
            let sub = step.name.substring(0, lastWord.length).toLowerCase()
            
            if(lastWord == sub)
                nStep.push(step)
        }

        setDisplayStep(nStep)
    }

    function onTabClick(e: any, name: string, iso3: string) {
        e.preventDefault()

        let split = inputRef.current!.value.toLowerCase().split(" ")
        split[split.length - 1] = name
        let fString = ""
        for(let i = 0; i < split.length; i++) {
            let text = split[i]
            if(i == 0)
                text = capitalize(text)

            fString += text + " "
        }

        inputRef.current!.value = ""
        inputRef.current!.value = fString
        onBlur()

        setActiveSearch({iso3: iso3, fullname: name})
    }

    return (
        <div className="search-container" onFocus={onFocus} tabIndex={0}  >
            <div className="form-container">
                <div className="form-tab">
                    <div className="field">
                        <SearchIcon />
                        <p className="placeholder" ref={placeholderRef}>Search Country</p>

                        <form>
                            <input ref={inputRef} className="text-field" onKeyUp={onKeyUpInput} autoComplete="off" type="text" onBlur={onBlur} />
                        </form>
                    </div>
                    <div className="search-btn"></div>
                </div>
            </div>

            <div className="result-tab" ref={resultTabRef} onClick={(e) => {e.preventDefault()}}>
                <div className="result-section">
                    <div className="ul-title"><p>actions</p></div>

                    <div className="ul">
                        {displayStep.map((step) => (
                            <div className="li" onClick={(e) => {onTabClick(e, step.name, step.iso3)}}>
                                <div className="icon"> {step.icon} </div>
                                <div className="text">{step.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CountrySearch