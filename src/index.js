import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'

//styles
import './style/index.scss'

//views
import ProjectDashboard from './views/ProjectDashboard'
import ProjectEditor from './views/ProjectEditor'

import store from './redux/store'
import { Provider } from 'react-redux'

import ProjectModal from './components/project-components/project-modal'

import { useSelector, useDispatch } from "react-redux"

function StateManager() {

    const app_state = useSelector(state => state.stateReducer)
    
    let component

    if(app_state.current_panel == "project_dashboard")
        component = <ProjectDashboard />
    if(app_state.current_panel == "project_editor")
        component = <ProjectEditor />

    return (
        <div className="container">
            {component}
        </div> 
    )
}

function App() {
    return (
        <Provider store={store}>
            <StateManager />

            <ProjectModal />
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))