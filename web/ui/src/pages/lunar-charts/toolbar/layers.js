import React from "react"
import useStyles from "./toolbar.styles"

import { AiOutlineAreaChart } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'

import {
    Text,
    Menu
} from "@mantine/core"

const Layers = ({ }) => {
    const { classes } = useStyles()

    return (
        <div>
            <div className={classes.staticItem}>
                <div className={classes.staticInner}>
                    <div className={classes.staticText}>
                        <span className={classes.leftLine} />
                        <AiOutlineAreaChart size={22} style={{ marginLeft: 5 }} />
                        <Text weight={700} style={{ paddingTop: 3 }}>USA National GDP</Text>
                    </div>
                    <Menu>
                        <Menu.Item icon={<MdDelete />}>Delete</Menu.Item>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default Layers