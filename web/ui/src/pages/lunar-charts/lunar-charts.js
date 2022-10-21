import React, { useEffect, useState } from "react"

import Navbar     from "./navbar/navbar"
import Toolbar    from "./toolbar/toolbar"
import TabManager from "./tab-manager/tab-manager"

import { RemoveIndicator } from "../../data/actions/projectActions"

import DemoModal from "./demo-modal/demo-modal"

import useStyles from "./lunar-charts.styles"

import { LoadProject } from "../../data/actions/projectActions"
import { connect }     from "react-redux"

import { useSearchParams } from 'react-router-dom'

const LunarCharts = ({ project, user, removeIndicator, loadProject }) => {
    const { classes }                               = useStyles()
    const [displayLoginModal, setDisplayLoginModal] = useState(false)
    const [searchParams]                            = useSearchParams()

    function LoadProject() {
        let projectId = searchParams.get('projectId')
        if(projectId == null) {
            return
        }

        const jwt_token = user.jwtToken
        const u_state   = user.userState
        if(u_state !== "logged_in")
            return

        //load the project
        try {
            
            fetch(`/api/v1/drive/projects/${projectId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${jwt_token}` 
                }
            })
            .then(res => res.json())
            .then(data => {
                let id   = data['project']['project_id']
                let name = data['project']['project_name']
    
                let ind  = data['project']['project_data']['indicators']
                let doc  = data['project']['project_data']['documents']
    
                loadProject(name, id, ind, doc)
            })
        } catch (error) {
            window.location.replace('/')
        }
    }

    useEffect(() => {
        //load the project
        LoadProject()
    }, [])

    useEffect(() => {
        //Load the project
        LoadProject()
    }, [searchParams])

    useEffect(() => {
        let project_id         = project.project_id
        let project_indicators = project.project_data.indicators
        let user_state         = user.userState
        
        let project_flag = project_id == "demo"
        let indi_flag    = project_indicators.length > 1
        let user_flag    = user_state == "logged_in"

        if(project_flag && indi_flag && !user_flag)
            setDisplayLoginModal(true)
        else
            setDisplayLoginModal(false)
    }, [project])

    function CloseDemoModal() {
        let project_indicators = project.project_data.indicators
        let project_indicator  = project_indicators[project_indicators.length - 1]
        
        let ind_id = project_indicator.indicator_id
        let obj_id = project_indicator.object_id

        removeIndicator(ind_id, obj_id)
    }

    return (
        <div className={classes.wrapper}>
            <Navbar />
            <DemoModal active={displayLoginModal} close={CloseDemoModal} />

            <div className={classes.body}>
                <Toolbar />
                
                <TabManager />
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    removeIndicator: ( indicator_id, object_id ) => dispatch(RemoveIndicator(indicator_id, object_id)),
    loadProject: ( name, id, ind, doc ) => dispatch(LoadProject(name, id, ind, doc))
})

const mapStateToProps = state => ({
    project: state.project,
    user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(LunarCharts)