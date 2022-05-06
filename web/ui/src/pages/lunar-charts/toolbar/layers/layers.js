import React, { useEffect, useState } from "react"
import useStyles from "../toolbar.styles"

import { AiOutlineAreaChart } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'

import {
    Text,
    Menu
} from "@mantine/core"

import { connect } from 'react-redux'
import { GetIndicator } from "../../../../data/backend/datasets"

const Layers = ({ indicators }) => {
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
                <div className={classes.staticItem}>
                    <div className={classes.staticInner}>
                        <div className={classes.staticText}>
                            <span className={classes.leftLine} />
                            <AiOutlineAreaChart size={22} style={{ marginLeft: 5 }} />
                            <Text weight={700} style={{ paddingTop: 3 }}>{step.iso3.toUpperCase()} {step.simpleName}</Text>
                        </div>
                        <Menu>
                            <Menu.Item icon={<MdDelete />}>Delete</Menu.Item>
                        </Menu>
                    </div>
                </div>
            ))}
        </div>
    )
}

const mapStateToProps = state => ({
    indicators: state.lunar.indicators
})

const mapDispatchToProps = state => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Layers)