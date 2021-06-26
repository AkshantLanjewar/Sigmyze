import React from "react"

import Project from './project'

class ProjectViewer extends React.Component {
    constructor() {
        super()

        this.state = {
            projects: [
                {grid_active: false},
                {grid_active: false}
            ]
        }

        this.singleClickProject = this.singleClickProject.bind(this)
    }

    singleClickProject(index) {
        let projects = this.state.projects

        for(let i = 0; i < projects.length; i++) {
            let project = projects[i]
            
            if(i == index) {
                project["grid_active"] = true
                projects[i] = project
            } else {
                project["grid_active"] = false
                projects[i] = project
            }
        }

        this.setState({...this.state, projects: projects})
    }

    doubleClickProject(index) {
        
    }

    render() {
        return (
            <div className="container">
                <div className="header">
                    <span>Project Type</span>
                </div>

                <div className="projects">
                    <div className="grid">
                        {this.state.projects.map((object, index) => {
                            return <Project grid_active={object.grid_active} sClick={this.singleClickProject} index={index} key={"project-key-" + index} />
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default ProjectViewer