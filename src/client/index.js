import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Homepage from './pages/homepage/homepage'
import LostPage from './pages/404-page'
import IndicatorPage from './pages/country/country'
import ChartBuilderPage from './pages/chart-builder/index';

import UserAuth from './components/user/user-auth';
import UserVerify from './components/user/user-verify'
import Modal from './components/modal'
import UserDropdown from './components/user/user-dropdown'
import Toastbar from './components/toast'

import { HiOutlineMenuAlt1 } from 'react-icons/hi'
import { RiHomeFill, RiBarChartBoxFill, RiOmega } from 'react-icons/ri'

import Logo from '../svg/logo.svg'
import './sass/index.scss' 

let pageNav = [
    { name: "Homepage", icon: <RiHomeFill />, active: false, url: '/' },
    { name: "Indicators", icon: <RiBarChartBoxFill />, active: false, url: '/indicator' },
    { name: "Charts", icon: <RiOmega />, active: false, url: '/chart' }
]

function App() {
    //refs
    const sidenavRef = React.createRef()
    const togglerRef = React.createRef()
    const topRef = React.createRef()
    const mainRef = React.createRef()

    function ToggleSidenav() {
        sidenavRef.current.classList.toggle("expand")
        togglerRef.current.classList.toggle("expand")
        topRef.current.classList.toggle("expand")
        mainRef.current.classList.toggle("expand")
    }

    const [loginState, setLoginState]   = useState(false)
    const [verifyState, setVerifyState] = useState(false)

    const [userTitle, setUserTitle] = useState("Login")
    const [navState, setNavState] = useState(pageNav)
    const [loggedIn, setLoggedIn] = useState({ logged: false, verified: false })
    const [messages, setMessages] = useState([])

    useEffect(() => {
        let path = window.location.pathname
        let tNavState = navState
        for(let i = 0; i < tNavState.length; i++) {
            let nav = tNavState[i]
            nav['active'] = false

            if(nav.url == path)
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

    return (
        <div>
            <Toastbar messages={messages} />
            
            <Modal viewState={loginState} setViewState={setLoginState} title={userTitle} small={true}>
                <UserAuth setUserTitle={setUserTitle} setMessages={setMessages} />
            </Modal>

            <Modal viewState={verifyState} setViewState={setVerifyState} title={"Verify Account"} small={true}>
                <UserVerify setMessages={setMessages} />
            </Modal>

            <aside className='sidenav' ref={sidenavRef}>
                <div className='nav'>
                    <div className='brand'>
                        <a href='/'>
                            <img src={Logo} className='mini' alt='Logo' />
                            <span className='truncate'>Lunar</span>
                        </a>
                    </div>

                    <div className='content'>
                        <ul style={{marginTop: "1em"}}>
                            {navState.map((step) => {
                                return (
                                    <li className={`tooltip-right t-side ${step.active ? "active" : ""}`} data-tooltip={step.name}>
                                        <a href={step.url}>
                                            {step.icon}
                                            <span className='truncate'>{step.name}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
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
                            {loggedIn.logged  
                                ? ( 
                                    loggedIn.verified 
                                    ? <UserDropdown /> 
                                    : ( <li style={{marginLeft: "1em"}}>
                                            <a className='login-btn' onClick={() => { setVerifyState(true) }}>Verify</a>
                                        </li> )
                                )
                                : (<li style={{marginLeft: "1em"}}>
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
                        <Route exact path="/chart" component={ChartBuilderPage} />

                        <Route
                            path="/indicator"
                            render={({ match: { url } }) => (
                                <>
                                    <Route path={`${url}/`} component={IndicatorPage} exact />
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

window.onerror = function(message, url, lineNumber) {
    return true
}