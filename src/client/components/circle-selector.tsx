import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

//ICONS
import { FaIndustry } from 'react-icons/fa'
import { RiGovernmentFill, RiMoneyDollarBoxFill } from 'react-icons/ri'

const IconDICT = {
    "GDP": <FaIndustry />,
    "GOVT": <RiGovernmentFill />,
    "INVEST": <RiMoneyDollarBoxFill />
}

type props = {
    inital_category: "GDP" | "GOVT" | "INVEST",
    index: number,
    updateSelected: Function
}

const CircleSelector: React.FC<props> = ({ inital_category, index, updateSelected }) => {

    const uniqID = `circleSelect-${uuidv4()}`
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const url = "/api/data/indicator/categories"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setCategories(data)
            })
    }, [])

    let items = []
    for(let i = 0; i < categories.length; i++)
        items.push(<a className="itm" onClick={() => { updateSelected(index, categories[i]) }}> {IconDICT[categories[i]]} <div>{categories[i]}</div> </a>)

    let titleCard = (<label className="menu-open-btn" htmlFor={uniqID}>{IconDICT[inital_category]} <div>{inital_category}</div></label>)

    return (
        <div style={{marginTop: "32px"}}>
            <nav className="circle-selector">
                <input type="checkbox" className="menu-open" name="menu-open" id={uniqID} />
                {titleCard}                

                {items}
            </nav>

            {/* --FILTERS-- */}
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="filter">
                <defs>
                    <filter id="shadowed-goo">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
                        <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow" />
                        <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                        <feComposite in2="shadow" in="goo" result="goo" />
                        <feComposite in2="goo" in="SourceGraphic" result="mix" />
                    </filter>

                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feComposite in2="goo" in="SourceGraphic" result="mix" />
                    </filter>
                </defs>
            </svg>
        </div>
    )
}

export default CircleSelector