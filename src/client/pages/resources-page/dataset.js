import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import CountrySearch from './components/country-search'
import IconHash from '../../components/icon-hash'

import GridView from './views/grid'
import TableView from './views/table'
import IndicatorView from './views/modal-view'
import Modal from '../../components/modal'

import { CgMenuGridO } from 'react-icons/cg'
import { BsListUl } from 'react-icons/bs'

function DatasetPage() {
    let { dataset } = useParams()
    dataset = dataset.toUpperCase()

    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState({ dataset: null, active: true })
    const [activeCountry, setActiveCountry] = useState({iso3: "USA", fullname: "United States"})
    const [activeIndicator, setActiveIndicator] = useState(null)

    const [validSet, setValidSet] = useState(true)
    const [viewType, setViewType] = useState(true)
    const [modalState, setModalState] = useState(false)

    useEffect(() => {
        let category_url = `/api/data/v2/datasets/${dataset}/categories`
        fetch(category_url)
            .then(response => response.json())
            .then(data => {
                if(data.error && data.msg == "dataset_404") {
                    setValidSet(false)
                    return
                }

                let rCategory = []

                for(let i = 0; i < data.data.length; i++)
                    rCategory.push({dataset: data.data[i].replace(dataset, ""), active: false})
                rCategory[0].active = true
                setCategories(rCategory)
                setActiveCategory(rCategory[0])
            })
    }, [])

    function SetTab(tabname) {
        let tCategories = categories
        let fCategory   = null

        for(let i = 0; i < tCategories.length; i++) {
            tCategories[i].active = false
            if(tCategories[i].dataset == tabname) {
                tCategories[i].active = true
                fCategory = tCategories[i]
            }
        }

        setCategories([...tCategories])
        setActiveCategory({...fCategory})
    }

    return (
        <div className="datasets" style={{height: "100%"}}>
            {validSet
                ? (
                    <div className='inner'>
                        <div className='header'>
                            <div className='title'>
                                <h1>World Economic Outlook</h1>
                                <h5>WEO</h5>
                            </div>

                            <CountrySearch initalFullName={activeCountry.fullname} setActiveSearch={setActiveCountry} />

                            <div className='tab-container' style={{marginTop: "-1em"}}>
                                <div className='tabs' style={{ justifySelf: "center" }}>
                                    <ul>
                                        {categories.map((step) => {
                                            return (
                                                <li>
                                                    <a className={step.active ? 'active' : ''} onClick={() => { SetTab(step.dataset) }}>
                                                        <span>{IconHash['Covid']}</span>
                                                        <span>{step.dataset}</span>
                                                    </a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className='body' style={{ paddingBottom: "2rem" }}>
                            <div className='tab-container' style={{ justifyContent: "flex-end", width: "95%", marginBottom: "1rem" }}>
                                <div className='tabs'>
                                    <ul>
                                        <li>
                                            <a className={viewType ? 'active' : ''} onClick={() => { setViewType(true) }}>
                                                <span><CgMenuGridO /></span>
                                            </a>
                                        </li>

                                        <li>
                                            <a className={viewType ? '' : 'active'} onClick={() => { setViewType(false) }}>
                                                <span><BsListUl /></span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            {viewType
                                ? <GridView dataset={dataset} 
                                    activeCategory={activeCategory} 
                                    activeCountry={activeCountry} 
                                    setModalState={setModalState} 
                                    setActiveIndicator={setActiveIndicator}  />
                                : <TableView dataset={dataset} 
                                    activeCategory={activeCategory} 
                                    activeCountry={activeCountry} 
                                    setModalState={setModalState} 
                                    setActiveIndicator={setActiveIndicator}  />
                            }
                        </div>

                        <Modal viewState={modalState} setViewState={setModalState} title={""} large={true}>
                            <IndicatorView activeCountry={activeCountry} activeIndicator={activeIndicator} dataset={dataset} />
                        </Modal>
                    </div>
                )
                : ( 
                    <div>
                        <h1>Sorry the Dataset you Requested is not available</h1>
                        <a href="/datasets" style={{ textDecoration: "none", color: "white" }}>Lets get you back</a>
                    </div> 
                )
            }
        </div>
    )
}

export default DatasetPage