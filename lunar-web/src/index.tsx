import React from "react";
import ReactDOM from "react-dom";

import './style/index.scss';

//react router
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"

import Navbar from "./components/navbar";

//importing the different pages
import IndexPage from "./home";
import IndicatorOverview from "./indicator-page";

function App() : JSX.Element {
    return (
        <div>
            <Router>
                <Navbar />

                <Switch>
                    <Route exact path="/" component={IndexPage} />
                    <Route path="/:indicator" children={<IndicatorOverview />} />
                </Switch>
            </Router>
        </div>
    )   
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);