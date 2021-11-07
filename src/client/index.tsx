import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Homepage from './s-pages/homepage/homepage'
import LostPage from './404-page'
import BlogDirectory from './s-pages/blog/blog-directory'
import Post from './s-pages/blog/post'


import IndicatorPage from './s-pages/country/country'

import './sass/index.scss'

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Homepage} /> 
                    <Route exact path="/post/:postID" component={Post} />

                    <Route
                        path="/compare"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={IndicatorPage} exact />
                            </>
                        )} />

                    <Route 
                        path="/blog"
                        render={({ match: { url } }) => (
                            <>
                                <Route path={`${url}/`} component={BlogDirectory} exact />
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