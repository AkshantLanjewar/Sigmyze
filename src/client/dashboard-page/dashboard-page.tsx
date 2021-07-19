import React from "react";
import './sass/dashboard.scss'

import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from 'react-router-dom'

import { BsKanban, BsCalendarFill, BsPeopleFill, BsFolderFill } from 'react-icons/bs'

function DashboardPage() {
    return (
        <div className="dashboard">
            <div className="header">

            </div>

            <div className="main">
                <div className="sidebar">
                    <h4>BUSINESS NAME Dashboard</h4>

                    <div className="panel">
                        <ul className="panel-items">
                            <li className="panel"> 
                                <BsKanban /> 
                                <span>Agenda</span>
                            </li>
                            
                            <li className="panel">
                                <BsCalendarFill />
                                <span>Calendar</span>
                            </li>

                            <li className="panel">
                                <BsPeopleFill />
                                <span>Contacts</span>
                            </li>

                            <li className="panel">
                                <BsFolderFill />
                                <span>Projects</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    
                </div>
            </div>
        </div>
    )
}

export default DashboardPage