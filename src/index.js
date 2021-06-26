import React from 'react'
import ReactDOM from 'react-dom'

//styles
import './style/index.scss'

//views
import ProjectDashboard from './views/ProjectDashboard'

import store from './redux/store'
import { Provider } from 'react-redux'

import ProjectModal from './components/project-components/project-modal'

function StateManager() {
    return (
        <div className="container">
            <ProjectDashboard />
        </div> 
    )
}

class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <StateManager />

                <ProjectModal />
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))