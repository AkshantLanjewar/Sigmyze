import React from "react"

import { AiOutlineLineChart } from 'react-icons/ai'
import { MdCompare } from 'react-icons/md'

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
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

function CountrySearch() {
    const placeholderRef = React.createRef<HTMLDivElement>()
    const inputRef = React.createRef<HTMLInputElement>()

    function onFocus() {
        placeholderRef.current!.style.opacity = "0"
        inputRef.current!.value = ""
    }

    function onBlur() {
        placeholderRef.current!.style.opacity = "1"
        inputRef.current!.value = ""
    }

    return (
        <div className="search-container">
            <div className="form-container">
                <div className="form-tab">
                    <div className="field">
                        <SearchIcon />
                        <p className="placeholder" ref={placeholderRef}>Search Country</p>

                        <form>
                            <input ref={inputRef} onFocus={onFocus} onBlur={onBlur} className="text-field" autoComplete="off" type="text" />
                        </form>
                    </div>
                    <div className="search-btn"></div>
                </div>
            </div>

            <div className="result-tab">
                <div className="result-section">
                    <div className="ul-title"><p>actions</p></div>

                    <div className="ul">
                        <div className="li">
                            <div className="icon"> <AiOutlineLineChart /> </div>
                            <div className="text">Indicators</div>
                        </div>

                        <div className="li">
                            <div className="icon"> <MdCompare /> </div>
                            <div className="text">Comparison</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CountrySearch