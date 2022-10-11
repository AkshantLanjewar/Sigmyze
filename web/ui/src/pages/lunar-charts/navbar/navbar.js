import React, { useState } from "react"
import useStyles from "./navbar.styles"

import {
    Group,
    Button,
    Tooltip
} from "@mantine/core"

import { BiExit } from 'react-icons/bi'

import UserButton     from '../../../components/user-button/user-button'
import SaveController from "./save-controller"

import Filename from "./filename"

const Navbar = ({ }) => {
    const { classes } = useStyles()

    return (
        <div className={classes.navbar}>
            <Group position="apart" grow sx={{ width: "100%" }}>
                <Group position={"left"}>
                    <Tooltip 
                        position={"bottom"}
                        withArrow
                        label={"Exit Home"}
                    >
                        <Button 
                            p={"xs"} 
                            color={"indigo"}
                            component={"a"}
                            href={"/"}
                        >
                            <BiExit size={18} />
                        </Button>
                    </Tooltip>

                    <Filename />
                </Group>

                <Group position={"right"}>
                    <SaveController />
                    <UserButton />
                </Group>
            </Group>
        </div>
    )
}

export default Navbar