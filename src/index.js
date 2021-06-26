import React from 'react'
import ReactDOM from 'react-dom'

//styles
import './style/index.scss'

//views
import ProjectDashboard from './views/ProjectDashboard'

import store from './redux/store'
import { Provider } from 'react-redux'

import ProjectModal from './components/project-components/project-modal'

//react router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Route exact path="/">
                        <div className="container">
                            <ProjectDashboard />
                        </div>
                    </Route>

                    <Route path="/editor">
                        <div className="container">
                            
                        </div>
                    </Route>
                </Router>

                <ProjectModal />
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))