import React, { useEffect, useState } from "react"
import useStyles from "../toolbar.styles"

import { AiOutlineAreaChart } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'

import {
    Text,
    Menu,
    Tooltip
} from "@mantine/core"

import { connect } from 'react-redux'
import { GetIndicator } from "../../../../data/server-interface"
import { RemoveLunarIndicator } from "../../../../data/actions/lunarActions"

/*
    [COMPONENT] -> Layers

    [param] indicators: list of indicators with barebones info
        1. indicator_id
        2. object_id
        3. dataset
    [param] remove_indicator: function that removes indicator based on 
        1. indicator_id
        2. object_id
*/

const Layers = ({ indicators, remove_indicator }) => {
    const { classes } = useStyles()
    const [items, setItems] = useState([])

    /*
        MAIN FUNCTION IN COMPONENT
        [description] -> Grabs all the fine details of the indicators

        [fetch] GetIndicator -> data: grabs all the fine details
            1. indicator_id
            2. object_id
            3. indicator_name
    */

    async function main() {
        let indicators_ = []
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let data      = await GetIndicator(indicator.dataset, indicator.object_id, indicator.indicator_id)
            data['object_id'] = indicator.object_id
            indicators_.push(data)
        }

        setItems([...indicators_])
    }

    useEffect(() => {
        main()
    }, [])

    // update the main function every time the indicator list changes
    useEffect(() => {
        main()
    }, [indicators])

    return (
        <div>
            {items.map((step) => (
                <Tooltip 
                    position={"bottom"} 
                    withArrow 
                    label={`${step.object_id}: ${step.indicator_name}`} 
                    sx={(theme) => ({  width: "100%", body: { backgroundColor: theme.colors.dark[9] } })}
                >
                    <div className={classes.staticItem}>
                        <div className={classes.staticInner}>
                            <div className={classes.staticText}>
                                <span className={classes.leftLine} />
                                <AiOutlineAreaChart size={22} style={{ marginLeft: 5 }} />
                                <Text weight={700} style={{ paddingTop: 2, maxHeight: "100%", overflow: "hidden", maxWidth: "80%" }}>
                                    {step.indicator_id.toUpperCase()} : {step.object_id.toUpperCase()}
                                </Text>
                            </div>
                            <Menu>
                                <Menu.Item 
                                    icon={<MdDelete />}
                                    onClick={() => { remove_indicator(step.object_id.toUpperCase(), step.indicator_id.toUpperCase()) }}
                                >
                                    Delete
                                </Menu.Item>
                            </Menu>
                        </div>
                    </div>
                </Tooltip>
            ))}
        </div>
    )
}

const mapStateToProps = state => ({
    indicators: state.lunar.indicators
})

const mapDispatchToProps = dispatch => ({
    remove_indicator: (iso3, ind3) => dispatch(RemoveLunarIndicator(ind3, iso3))
})

export default connect(mapStateToProps, mapDispatchToProps)(Layers)