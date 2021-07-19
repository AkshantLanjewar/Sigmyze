import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Homepage from './homepage/homepage'
import Projectpage from './project-page/project-page'
import DashboardPage from './dashboard-page/dashboard-page'

import './index.scss'

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Homepage} /> 
                    <Route exact path="/business" component={Projectpage} />
                    <Route path="/dashboard/:dashboard" children={<DashboardPage />} />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))