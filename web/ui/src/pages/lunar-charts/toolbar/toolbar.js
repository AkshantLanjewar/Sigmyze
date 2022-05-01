import React, { useState } from "react"

import useStyles from "./toolbar.styles"
import { 
    Tooltip ,
    Text,
    Title,
    Menu
} from "@mantine/core"

import Layers       from "./layers"
import AddIndicator from "./add-indicator"

import { BsStack } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'

let actionBarItems = [
    { label: "Layers",        icon: <BsStack size={20} />, active: true },
    { label: "Add Indicators", icon: <IoMdAdd size={20} />, active: false }
]

const labelHash = {
    "Layers": <Layers />,
    "Add Indicators": <AddIndicator />
}

const Toolbar = ({ }) => {
    const { classes, cx } = useStyles()

    const [actionBar, setActionBar]       = useState(actionBarItems)
    const [activeAction, setActiveAction] = useState("Layers")

    function StackClick(label) {
        let barItems = actionBar

        for(let i = 0; i < barItems.length; i++) {
            let item    = barItems[i]
            item.active = false

            if(item.label == label)
                item.active = true
            barItems[i] = item
        }

        setActionBar([...barItems])
        setActiveAction(label)
    }

    return (
        <div className={classes.toolbar}>
            <div className={classes.actionBar}>
                {actionBar.map((step) => (
                    <Tooltip
                        label={step.label}
                        position={"right"}
                        withArrow
                    >
                        <div className={cx(classes.actionItem, { [classes.active]: step.active })} onClick={() => { StackClick(step.label) }}>
                            {step.icon}
                        </div>
                    </Tooltip>
                ))}
            </div>

            <div className={classes.contentBar}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Text className={classes.contentTitle}>{activeAction}</Text>

                    {labelHash[activeAction]}
                </div>
            </div>
        </div>
    )
}

export default Toolbar