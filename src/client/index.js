import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Homepage from './s-pages/homepage/homepage'
import LostPage from './404-page'
import IndicatorPage from './s-pages/country/country'
import AboutUsPage from './s-pages/about/about'
import ResourcesPage from './s-pages/about/resources'
import WeoDef from './s-pages/about/weodef'
import ChartBuilderPage from './u-pages/chart-builder/index';

import './sass/index.scss'

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Homepage} />
                    //<Route exact path="/chart" component={ChartBuilderPage} />
                    //<Route exact path="/about" component={AboutUsPage} />

                    <Route
                        path="/indicator"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={IndicatorPage} exact />
                            </>
                          )} />

                    <Route
                        path="/about"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={AboutUsPage} exact />
                            </>
                          )} />

                    <Route
                        path="/chart"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={ChartBuilderPage} exact />
                            </>
                          )} />

                    <Route
                        path="/resources"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={ResourcesPage} exact />
                            </>
                          )} />

                    <Route
                        path="/weodef"

                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={WeoDef} exact />
                            </>
                          )} />

                    {/*<Route exact path="/business" component={Projectpage} />
                    <Route path="/dashboard/:dashboard" children={<DashboardPage />} />*/}

                    <Route component={LostPage} />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))

window.onerror = function(message, url, lineNumber) {
    return true
}
