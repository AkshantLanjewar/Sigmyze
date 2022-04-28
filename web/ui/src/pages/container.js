import React from "react"

//react router
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//import the pages
import Homepage  from "./homepage/homepage"
import About     from "./about/about"
import Resources from "./indicators/indicators"

import { ScrollArea } from "@mantine/core"

const Container = ({ expandAside }) => {
    return (
        <div className="wrap">
            <ScrollArea style={{ height: "calc(100vh - 60px)" }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/"           element={ <Homepage /> } />
                        <Route path="/about"      element={ <About /> } />
                        <Route path="/indicators" element={ <Resources /> } />
                    </Routes>
                </BrowserRouter>
            </ScrollArea>
        </div>
    )
}

export default Container