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
import { GetIndicator } from "../../../../data/backend/datasets"
import { RemoveLunarIndicator } from "../../../../data/actions/lunarActions"

const Layers = ({ indicators, remove_indicator }) => {
    const { classes } = useStyles()
    const [items, setItems] = useState([])

    async function main() {
        let indicators_ = []
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let data      = await GetIndicator(indicator.dataset, indicator.iso3, indicator.ind3)
            indicators_.push(data)
        }

        setItems([...indicators_])
    }

    useEffect(() => {
        main()
    }, [indicators])

    return (
        <div>
            {items.map((step) => (
                <Tooltip 
                    position={"bottom"} 
                    withArrow 
                    label={step.simpleName} 
                    sx={(theme) => ({  width: "100%", body: { backgroundColor: theme.colors.dark[9] } })}
                >
                    <div className={classes.staticItem}>
                        <div className={classes.staticInner}>
                            <div className={classes.staticText}>
                                <span className={classes.leftLine} />
                                <AiOutlineAreaChart size={22} style={{ marginLeft: 5 }} />
                                <Text weight={700} style={{ paddingTop: 2, maxHeight: "100%", overflow: "hidden", maxWidth: "80%" }}>
                                    {step.iso3.toUpperCase()} {step.ind3.toUpperCase()}
                                </Text>
                            </div>
                            <Menu>
                                <Menu.Item 
                                    icon={<MdDelete />}
                                    onClick={() => { remove_indicator(step.iso3.toUpperCase(), step.ind3.toUpperCase()) }}
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