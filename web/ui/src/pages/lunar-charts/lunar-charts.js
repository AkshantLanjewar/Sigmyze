import React, { useEffect, useState } from "react"

import Navbar     from "./navbar/navbar"
import Toolbar    from "./toolbar/toolbar"
import TabManager from "./tab-manager/tab-manager"

import { RemoveIndicator } from "../../data/actions/projectActions"

import DemoModal from "./demo-modal/demo-modal"

import useStyles from "./lunar-charts.styles"

import { connect } from "react-redux"

import { useSearchParams } from 'react-router-dom'

const LunarCharts = ({ project, user, removeIndicator }) => {
    const { classes }                               = useStyles()
    const [displayLoginModal, setDisplayLoginModal] = useState(false)
    const [searchParams]                            = useSearchParams()

    function LoadProject() {
        let projectId = searchParams.get('projectId')
        if(projectId == null)
            return

        console.log(projectId)
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
    removeIndicator: ( indicator_id, object_id ) => dispatch(RemoveIndicator(indicator_id, object_id))
})

const mapStateToProps = state => ({
    project: state.project,
    user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(LunarCharts)