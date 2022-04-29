import React, { useState } from "react"
import useStyles from "./navbar.styles"

import {
    Group,
    Button,
    Text,
    Input,
    Tooltip
} from "@mantine/core"

import { MdOutlineInsertDriveFile } from 'react-icons/md'
import { BiChevronDown, BiPlus } from 'react-icons/bi'

import { connect } from 'react-redux'
import { userModalAction } from '../../../data/actions/userActions'

function Filename() {
    const { classes } = useStyles()
    const [editName, setEditName] = useState(true)
    let opacity = editName ? 1 : 0

    return (
        <div>
            <Group className={classes.filenameGroup}>
                <MdOutlineInsertDriveFile size={14} style={{ opacity: opacity }} />
                <Text style={{ opacity: opacity }} className={classes.folder}>Folder Name /</Text>

                {editName
                    ? <Text className={classes.file} onClick={() => { setEditName(false) }}>Project Name</Text>
                    : (
                        <form onSubmit={() => { setEditName(true) }}>
                            <Input
                                variant={"unstyled"}
                                defaultValue={"Project Name"}
                                autoFocus
                                onBlur={() => { setEditName(true) }}
                            />
                        </form>
                    ) 
                }

                <BiChevronDown style={{ opacity: opacity }} size={14} />
            </Group>
        </div>
    )
}

const Navbar = ({ userModal, userModalAction }) => {
    const { classes } = useStyles()

    return (
        <div className={classes.navbar}>
            <Group position="apart" grow sx={{ width: "100%" }}>
                <Group position={"left"}>
                    <Filename />
                </Group>

                <Group position={"right"}>
                    <Tooltip 
                        label={"Add Component"}
                        radius={"xl"}
                        withArrow
                        position={"bottom"}
                    >
                        <Button variant={"subtle"} radius={"xl"} size={"sm"} style={{ padding: "0 9px" }}>
                            <BiPlus size={16} />
                        </Button>
                    </Tooltip>

                    <Button onClick={() => { userModalAction(true) }}>Login</Button>
                </Group>
            </Group>
        </div>
    )
}

const mapStateToProps = state => ({
    userModal: state.userModal
})

const mapDispatchToProps = dispatch => ({
    userModalAction: (payload) => dispatch(userModalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)