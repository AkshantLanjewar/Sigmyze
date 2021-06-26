import React from 'react'
import Navbar from '../components/navbar'

import SidebarItem from '../components/sidebar-item'
import ProjectViewer from '../components/project-components/project-viewer'

class ProjectDashboard extends React.Component {
    render() {
        return (
            <div>
                <Navbar />

                <main className="project-dashboard">
                    <div className="sidebar">
                        <ul>
                            <SidebarItem title="Home" icon="folder" />
                            <SidebarItem title="Favorited" icon="star" />
                            <SidebarItem title="Repositories" icon="repo" />
                        </ul>
                    </div>

                    <div className="main-content">
                        <div className="wrapper">
                            <ProjectViewer />
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default ProjectDashboard