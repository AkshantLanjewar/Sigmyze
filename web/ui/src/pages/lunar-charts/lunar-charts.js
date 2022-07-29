import React, { useEffect, useState } from "react"

import Navbar  from "./navbar/navbar"
import Toolbar from "./toolbar/toolbar"
import Chart   from "./chart/chart"

import { RemoveIndicator } from "../../data/actions/projectActions"

import DemoModal from "./demo-modal/demo-modal"

import useStyles from "./lunar-charts.styles"

import { connect } from "react-redux"

import { v4 as uuidv4 } from 'uuid'
import { FaMix } from 'react-icons/fa'

let default_tab = [
    {
        name: 'Combined Chart',
        icon: <FaMix size={14} />,
        editable: false,
        type: 'chart',

        names: [],
        data: [],
        id: uuidv4()
    }
]

const LunarCharts = ({ project, user, removeIndicator }) => {
    const { classes }                               = useStyles()
    const [displayLoginModal, setDisplayLoginModal] = useState(false)

    //chart glob states
    const [tabs, setTabs]             = useState(default_tab)
    const [hiddenTabs, setHiddenTabs] = useState([])
    const [openedTabs, setOpenedTabs] = useState([])

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

    function OpenTab(indicator_id, object_id) {
        let name = `${indicator_id}: ${object_id}`
        let tab  = null

        if(openedTabs.filter(e => e.name == name).length > 0)
            return
        for(let i = 0; i < hiddenTabs.length; i++) {
            let hiddenTab = hiddenTabs[i]
            if(hiddenTab.name == name)
                tab = hiddenTab
        }

        let o_tabs = tabs
        o_tabs.push(tab)
        setTabs([...o_tabs])
    }

    return (
        <div className={classes.wrapper}>
            <Navbar />
            <DemoModal active={displayLoginModal} close={CloseDemoModal} />

            <div className={classes.body}>
                <Toolbar openTab={OpenTab} />
                
                <Chart 
                    tabs={tabs} 
                    setTabs={setTabs} 
                    openedTabs={openedTabs} 
                    setOpenedTabs={setOpenedTabs}
                    setHiddenTabs={setHiddenTabs} 
                />
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