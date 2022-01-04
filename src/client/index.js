import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Homepage from './pages/homepage/homepage'
import LostPage from './pages/404-page'
import IndicatorPage from './pages/country/country'
import ChartBuilderPage from './pages/chart-builder/index';

import { HiOutlineMenuAlt1 } from 'react-icons/hi'
import { FaHome } from 'react-icons/fa'

import Logo from '../svg/logo.svg'

import './sass/index.scss' 

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

    return (
        <div>
            <aside className='sidenav' ref={sidenavRef}>
                <div className='nav'>
                    <div className='brand'>
                        <a href='/'>
                            <img src={Logo} className='mini' alt='Logo' />
                            <span className='truncate'>Lunar</span>
                        </a>
                    </div>

                    <div className='content'>
                        <ul>
                            <li>
                                <a href='/' data-original-title="Homepage">
                                    <FaHome />
                                    <span className='truncate'>Homepage</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            <header className='topnav' ref={topRef}>
                <div className='nav'>
                    <div className='left'>
                        <button className='toggler' onClick={ToggleSidenav} ref={togglerRef}>
                            <HiOutlineMenuAlt1 />
                        </button>
                    </div>

                    <div className='right'>
                        <ul>
                            <li style={{marginLeft: "1em"}}>
                                <a className='login-btn'>Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <main className='main-content' ref={mainRef}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Homepage} /> 
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