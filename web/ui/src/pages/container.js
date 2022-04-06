import React from "react"

//react router
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//import the pages
import Homepage from "./homepage/homepage"
import About    from "./about/about"

const Container = ({ expandAside }) => {
    return (
        <div className="wrap">
            <BrowserRouter>
                <Routes>
                    <Route path="/"      element={ <Homepage /> } />
                    <Route path="/about" element={ <About /> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Container