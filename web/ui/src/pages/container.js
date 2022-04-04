import React from "react"

//react router
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//import the pages
import Homepage from "./homepage/homepage"

const Container = ({ expandAside }) => {
    return (
        <div className="wrap">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Homepage /> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Container