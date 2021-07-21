import React from "react";
import './sass/dashboard.scss'

import {
    Switch,
    Route,
    Link,
    useRouteMatch,
} from 'react-router-dom'

import { BsKanban, BsCalendarFill, BsFolderFill } from 'react-icons/bs'

import AgendaFragment from './agenda-page'

function DashboardPage() {

    let kanbanClasses   = "panel"
    let calendarClasses = "panel"
    let projectClasses  = "panel"

    let locationSplit = location.pathname.split("/")
    let currSubpage   = locationSplit[locationSplit.length - 1].toLowerCase()

    let { url, path } = useRouteMatch()

    if(currSubpage == "agenda") kanbanClasses = "panel active"
    if(currSubpage == "calendar") calendarClasses = "panel active"
    if(currSubpage == "project") projectClasses = "panel active"

    return (
        <div className="dashboard">
            <div className="header">

            </div>

            <div className="main">
                <div className="sidebar">
                    <h4>BUSINESS NAME Dashboard</h4>

                    <div className="panel">
                        <ul className="panel-items">
                            <Link to={`${url}/agenda`}>
                                <li className={kanbanClasses}> 
                                    <BsKanban /> 
                                    <span>Agenda</span>
                                </li>
                            </Link>
                            
                            <Link to={`${url}/calendar`}>
                                <li className={calendarClasses}>
                                    <BsCalendarFill />
                                    <span>Calendar</span>
                                </li>
                            </Link>

                            <Link to={`${url}/project`}>
                                <li className={projectClasses}>
                                    <BsFolderFill />
                                    <span>Projects</span>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <Switch>
                        <Route path={`${path}/agenda`}>
                            <AgendaFragment />
                        </Route>

                        <Route path={`${path}/calendar`}>
                            calendar
                        </Route>

                        <Route path={`${path}/project`}>
                            project
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage