import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Homepage from './pages/homepage/homepage'
import LostPage from './pages/404-page'
import ChartBuilderPage from './pages/chart-builder/index';
import AboutUsPage from './pages/about/about'
import ResourcesPage from './pages/resources-page'
import DatasetPage from './pages/resources-page/dataset'

import UserAuth from './components/user/user-auth';
import UserVerify from './components/user/user-verify'
import Modal from './components/modal'
import UserDropdown from './components/user/user-dropdown'
import Toastbar from './components/toast'
import ChartComponents from './components/chart-builder/side-components'
import ComponentModal from './components/chart-builder/component-adder'

import { HiOutlineMenuAlt1, HiOutlinePlusCircle } from 'react-icons/hi'
import { RiHomeFill } from 'react-icons/ri'
import { AiOutlineQuestionCircle, AiFillDatabase } from 'react-icons/ai'

function Omega() {
    return (
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill-rule="nonzero" d="M14 20v-2.157c1.863-1.192 3.5-3.875 3.5-6.959 0-3.073-2-6.029-5.5-6.029s-5.5 2.956-5.5 6.03c0 3.083 1.637 5.766 
                    3.5 6.958V20H3v-2h4.76C5.666 16.505 4 13.989 4 10.884 4 6.247 7.5 3 12 3s8 3.247 8 7.884c0 3.105-1.666 5.621-3.76 7.116H21v2h-7z"></path>
            </g>
        </svg>
    )
}

import Logo from '../svg/logo.svg'
import './sass/index.scss'

let pageNav = [
    { name: "Homepage", icon: <RiHomeFill />, active: false, url: '/' },
    { name: "Charts", icon: <Omega />, active: false, url: '/chart' },
    { name: "Datasets", icon: <AiFillDatabase />, active: false, url: '/datasets' },
    { name: "About Us", icon: <AiOutlineQuestionCircle />, active: false, url: '/about' }
]

function App() {
    //refs
    const sidenavRef = React.createRef()
    const togglerRef = React.createRef()
    const topRef = React.createRef()
    const mainRef = React.createRef()

    function ToggleSidenav() {
        let activePage = {}
        for (let i = 0; i < navState.length; i++) {
            if (navState[i].active == true)
                activePage = navState[i]
        }

        if (activePage.name == "Charts")
            return

        sidenavRef.current.classList.toggle("expand")
        togglerRef.current.classList.toggle("expand")
        topRef.current.classList.toggle("expand")
        mainRef.current.classList.toggle("expand")
    }

    const [loginState, setLoginState] = useState(false)
    const [verifyState, setVerifyState] = useState(false)

    const [userTitle, setUserTitle] = useState("Login")
    const [navState, setNavState] = useState(pageNav)
    const [loggedIn, setLoggedIn] = useState({ logged: false, verified: false })
    const [messages, setMessages] = useState([])

    useEffect(() => {
        let path = window.location.pathname
        let tNavState = navState
        for (let i = 0; i < tNavState.length; i++) {
            let nav = tNavState[i]
            nav['active'] = false

            if (nav.url == path)
                nav['active'] = true
            tNavState[i] = nav
        }

        let checkUrl = "/user/isLoggedIn"
        fetch(checkUrl)
            .then(response => response.json())
            .then(data => {
                setLoggedIn(data)
            })

        setNavState([...tNavState])
    }, [])


    const [chartModal, setChartModal]             = useState(false)
    const [activeIndicators, setActiveIndicators] = useState([])
    const [chartView, setChartView]               = useState(false)

    function DeleteIndicators(iso3, ind3, dataset) {
        //find the indicator
        let t_indicator = activeIndicators
        let index       = 0

        for(let i = 0; i < t_indicator.length; i++) {
            let indicator = t_indicator[i]
            let iso3_t      = indicator.iso3
            let ind3_t      = indicator.ind3
            let dataset_t   = indicator.dataset

            if(dataset_t == dataset && ind3_t == ind3 && iso3_t == iso3)
                index = i
        }

        t_indicator.splice(index, 1)
        setActiveIndicators([...t_indicator])
    }

    function OnChartBuilder() {
        togglerRef.current.click()
        setChartView(true)
    }

    return (
        <div>
            <Toastbar messages={messages} />

            <Modal viewState={loginState} setViewState={setLoginState} title={userTitle} small={true}>
                <UserAuth setUserTitle={setUserTitle} setMessages={setMessages} />
            </Modal>

            <Modal viewState={verifyState} setViewState={setVerifyState} title={"Verify Account"} small={true}>
                <UserVerify setMessages={setMessages} />
            </Modal>

            <ComponentModal 
                viewState={chartModal} 
                setViewState={setChartModal} 
                activeIndicators={activeIndicators} 
                setActiveIndicators={setActiveIndicators}  />

            <aside className='sidenav' ref={sidenavRef}>
                <div className='nav'>
                    <div className='brand'>
                        <a href='/'>
                            <img src={Logo} className='mini' alt='Logo' />
                            <span className='truncate'>Lunar</span>
                        </a>
                    </div>

                    <div className='content'>
                        <ul style={{ marginTop: "1em" }}>
                            {navState.map((step) => {
                                return (
                                    <li className={`tooltip-right t-side ${step.active ? 'active' : ''}`} data-tooltip={step.name}>
                                        <a href={step.url}>
                                            {step.icon}
                                            <span className='truncate'>{step.name}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                        
                        { chartView 
                            ? <ChartComponents activeIndicators={activeIndicators} deleteIndicators={DeleteIndicators} />
                            : null
                        }
                    </div>
                </div>
            </aside>

            <header className='topnav' ref={topRef}>
                <div className='nav'>
                    <div className='left'>
                        <button className='toggler tooltip-right' data-tooltip="Expand" onClick={ToggleSidenav} ref={togglerRef}>
                            <HiOutlineMenuAlt1 />
                        </button>
                    </div>

                    <div className='right'>
                        <ul>
                            {chartView
                                ? (
                                    <li className='add-component tooltip-bottom' data-tooltip="Add Component" onClick={() => { setChartModal(true) }}>
                                        <HiOutlinePlusCircle />
                                    </li>
                                )
                                : null
                            }
                            
                            {loggedIn.logged
                                ? (
                                    loggedIn.verified
                                        ? <UserDropdown />
                                        : (<li style={{ marginLeft: "1em" }}>
                                            <a className='login-btn' onClick={() => { setVerifyState(true) }}>Verify</a>
                                        </li>)
                                )
                                : (<li style={{ marginLeft: "1em" }}>
                                    <a className='login-btn' onClick={() => { setLoginState(true) }}>Login</a>
                                </li>)
                            }
                        </ul>
                    </div>
                </div>
            </header>

            <main className='main-content' ref={mainRef}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/">
                            <Homepage setLoginState={setLoginState} loggedIn={loggedIn} />
                        </Route>

                        <Route exact path="/chart">
                            <ChartBuilderPage OnChartBuilder={OnChartBuilder} activeIndicators={activeIndicators} />
                        </Route>
                        <Route exact path="/about" component={AboutUsPage} />

                        <Route
                            path="/datasets"
                            render={({ match: { url } }) => (
                                <>
                                    <Route path={`${url}/`} component={ResourcesPage} exact />
                                    <Route path={`${url}/:dataset`} component={DatasetPage} />
                                </>
                            )} />
                        <Route component={LostPage} />
                    </Switch>
                </BrowserRouter>
            </main>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
