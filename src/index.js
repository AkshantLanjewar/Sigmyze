import React from 'react'
import ReactDOM from 'react-dom'

//styles
import './style/index.css'

//views
import ProjectDashboard from './views/ProjectDashboard'

import store from './redux/store'
import { Provider } from 'react-redux'

import ProjectModal from './components/project-components/project-modal'

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div className="container">
                    <ProjectDashboard />
                </div>

                <ProjectModal />
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))