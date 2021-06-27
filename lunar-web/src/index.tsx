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

const App = () => (
    <div>
        <Router>
            <Navbar />
        </Router>
    </div>
);

ReactDOM.render(
    <App />,
    document.getElementById("root")
);