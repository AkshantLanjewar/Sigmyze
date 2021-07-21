import React from "react"
import './sass/agenda.scss'

import Sales from './agenda/sales'

function AgendaFragment() {
    return (
        <div className="agenda">
            <div className="pane dashboard">
                <div className="title-row">
                    <h2 className="title">Your Business</h2>

                    <div className="toolbar">
                        <div className="project">
                            <span>Create Project</span>
                        </div>
                    </div>
                </div>

                <Sales />
            </div>

            <div className="pane">

            </div>
        </div>
    )
}

export default AgendaFragment