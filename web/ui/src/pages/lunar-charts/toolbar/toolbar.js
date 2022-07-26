import React, { useState } from "react"

import useStyles from "./toolbar.styles"
import { 
    Tooltip ,
    Text,
    Title,
    Menu
} from "@mantine/core"

import Layers       from "./layers/layers"
import AddIndicator from "./add-indicator/add-indicator"

import { BsStack } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io' 

let actionBarItems = [
    { label: "Layers",        icon: <BsStack size={20} />,  active: true },
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
    const [openAdd, setOpenAdd]           = useState(false)

    function StackClick(label) {
        let barItems = actionBar

        for(let i = 0; i < barItems.length; i++) {
            let item    = barItems[i]
            if(label == "Add Indicators" && item.active)
                item.active = true
            else
                item.active = false

            if(label === "Add Indicators") {
                setOpenAdd(true)
                return
            }
            if(item.label == label && label !== "Add Indicators")
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