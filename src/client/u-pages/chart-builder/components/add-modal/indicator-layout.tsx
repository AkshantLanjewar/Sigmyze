import React, { useState, useEffect } from "react"
import { FcAreaChart } from "react-icons/fc"

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

type IndicatorProps = {
    activeCountry: any,
    submitStep: Function,
    setIndicatorGlobal: Function
}

const IndicatorLayout: React.FC<IndicatorProps> = ({activeCountry, submitStep, setIndicatorGlobal}) => {
    const inputRef = React.createRef<HTMLInputElement>()

    const [datasets, setDatasets] = useState([])
    const [activeDataset, setActiveDataset] = useState({})
    const [activeCategory, setActiveCategory] = useState(null)

    const [categoryNames, setCategoryNames] = useState([])
    const [displayIndicators, setDisplayIndicators] = useState([])
    const [indicators, setIndicators] = useState([])
    const [activeIndicator, setActiveIndicator] = useState(null)

    useEffect(() => {
        //get datasets
        let datasetURL = "/api/data/v2/datasets"
        fetch(datasetURL)
            .then(response => response.json())
            .then(data => {
                setDatasets(data)
                setActiveDataset(data[0])
            })
    }, [])

    useEffect(() => {
        if(activeDataset == {})
            return 
        
        let categoryUrl = `/api/data/v2/datasets/${activeDataset.name}/categories`
        fetch(categoryUrl)
            .then(response => response.json())
            .then(data => {
                let updatedList = []
                for(let i = 0; i < data.length; i++)
                    updatedList.push({name: data[i].replace(activeDataset.name, ''), class: ''})
                setCategoryNames(updatedList)
            })
    }, [activeDataset])

    useEffect(() => {
        if(categoryNames == [])
            return
        if(activeCountry == {})
            return

        let p_indicators = []
        for(let i = 0; i < categoryNames.length; i++) {
            let category = categoryNames[i]
            let indicatorUrl = `/api/data/v2/datasets/${activeDataset.name}/categories/${category.name}/${activeCountry.iso3}`
            
            let request = new XMLHttpRequest()
            request.open('GET', indicatorUrl, false)
            request.send(null)
            if(request.status == 200) {
                let json = JSON.parse(request.responseText)

                for(let i = 0; i < json.length; i++) {
                    let indicator = json[i]
                    indicator['category'] = category
                    indicator['class'] = ''
                    p_indicators.push(indicator)
                }
            }
        }

        setIndicators(p_indicators)
        
        if(activeCategory == null)
            setDisplayIndicators(p_indicators)
        else {
            let updatedIndicators = []
            for(let i = 0; i < indicators.length; i++) {
                let indicator = indicators[i]
                let uCat = indicator.category

                if(uCat.name == activeCategory.name)
                    updatedIndicators.push(indicator)
            }

            setDisplayIndicators(updatedIndicators)
        }
    }, [categoryNames])

    function OnCategoryClick(e: any, category: string) {
        e.preventDefault()

        let categoryList = categoryNames
        let p_activeCategory = {}

        for(let i = 0; i < categoryList.length; i++) {
            let uCat = categoryList[i]
            uCat.class = ''

            if(uCat.name == category) {
                uCat.class = 'active'
                p_activeCategory = uCat
            }

            categoryList[i] = uCat
        }

        setActiveCategory(p_activeCategory)
        setCategoryNames([...categoryList])
    }

    function onKeyUpInput(e: any) {
        e.preventDefault()
        let currentInput = inputRef.current!.value.toLowerCase()
        let pActiveCategory = activeCategory

        let step = []
        for(let i = 0; i < indicators.length; i++) {
            const nLastWord = currentInput.toLowerCase().replace(/\s/g, '').split("")

            let nStep = indicators[i]
            const nSub = nStep.name.toLowerCase().replace(/\s/g, '').split("")
            nSub.length = nLastWord.length

            let fits_category = false
            if(pActiveCategory == null)
                fits_category = true
            else if(pActiveCategory.name == nStep.category.name)
                fits_category = true 

            if(nLastWord.toString() == nSub.toString() && fits_category)
                step.push(nStep)
        }

        setDisplayIndicators(step)
    }

    function onIndicatorClick(e: any, name: string) {
        let pIndicators = indicators
        let pDisplayInd = displayIndicators
        let activeIndicator = {}

        for(let i = 0; i < pIndicators.length; i++) {
            let indicator = pIndicators[i]
            indicator.class = ''

            if(indicator.name == name)
                indicator.class = 'active'
            pIndicators[i] = indicator
            activeIndicator = indicator
        }

        for(let i = 0; i < pDisplayInd.length; i++) {
            let indicator = pDisplayInd[i]
            indicator.class = ''

            if(indicator.name == name)
                indicator.class = 'focus'
            pDisplayInd[i] = indicator
        }

        setIndicators([...pIndicators])
        setDisplayIndicators([...pDisplayInd])
        submitStep(true)
        setIndicatorGlobal(activeIndicator)
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
                <div className="side">
                    {datasets.map((step) => {
                        return (
                            <div className="tab">
                                <span className="icon"><FcAreaChart /></span>

                                <span className="tab-title">
                                    <span className="text">{step.name}</span>
                                </span>
                            </div>
                        )
                    })}
                </div>

                <div className="indicator-content">
                    <div className="pills">
                        {categoryNames.map((step) => (
                            <span className={"pill " + step.class} onClick={(e) => { OnCategoryClick(e, step.name) }}>
                                <span className="content">{step.name}</span>
                            </span>
                        ))}
                    </div>

                    <div className="indicators">
                        <div className="listContainer">
                            <div className="title-item">
                                <h3>Indicators</h3>
                            </div>

                            {displayIndicators.map((step) => {
                                return (
                                    <div className={"indicator " + step.class} onClick={(e) => { onIndicatorClick(e, step.name) }}>
                                        <div className="main-content">
                                            <span className="indicator-title">{step.name}</span>
                                        </div>

                                        <div className="actions">
                                            
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndicatorLayout