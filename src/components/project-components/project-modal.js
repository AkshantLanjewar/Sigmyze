import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import ProjectTemplate from "./project-template"

function ProjectModal() {
    
    const modal_open = useSelector(state => state.projectReducer)
    const dispatch = useDispatch()

    function closeModal() {
        dispatch({type: "CLOSE_MODAL"})
    }

    let modal_classes = "project-modal"

    if(modal_open.modal_open == true)
        modal_classes += " active"

    return (
        <div className={modal_classes}>
            <div className="modal">
                <div className="container">
                    <div className="pane">
                        <header>
                            <span>Create Project</span>
                            <span onClick={closeModal} className="close">×</span>
                        </header>

                        <main>
                            <span className="inset">
                                <span className="inner">
                                    <div className="scroll">
                                        <div className="templates-container">
                                            <h2 className="header">Official Templates</h2>

                                            <div className="body">
                                                <ProjectTemplate projectType={"data_scraper"} />
                                                <ProjectTemplate projectType={"database_io"} />
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </span>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectModal