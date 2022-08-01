import React, { useState } from "react"

import useStyles from "./toolbar.styles"
import { 
    Tooltip
} from "@mantine/core"

import Layers       from "./layers"
import AddIndicator from "./add-indicator/add-indicator"

import { BsStack } from 'react-icons/bs'

let actionBarItems = [
    { label: "Layers",        icon: <BsStack size={20} />,  active: true },
]

const Toolbar = ({ openTab }) => {
    const { classes, cx } = useStyles()

    const [actionBar, setActionBar]       = useState(actionBarItems)
    const [activeAction, setActiveAction] = useState("Layers")
    const [openAdd, setOpenAdd]           = useState(false)

    const labelHash = {
        "Layers": <Layers openTab={openTab} setOpenAdd={setOpenAdd} />,
        "Add Indicators": <AddIndicator />
    }

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
                    {labelHash[activeAction]}
                </div>
            </div>

            <AddIndicator 
                opened={openAdd}
                setOpened={setOpenAdd}
            />
        </div>
    )
}

export default Toolbar