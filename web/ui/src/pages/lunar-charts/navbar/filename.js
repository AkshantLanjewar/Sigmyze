import React, { useState, useEffect } from 'react'

import { 
    Group, 
    Text, 
    Input 
} from '@mantine/core'

import { MdOutlineInsertDriveFile } from 'react-icons/md'
import { BiChevronDown } from 'react-icons/bi'

import { useForm } from '@mantine/form'
import useStyles   from "./navbar.styles"
import { connect } from 'react-redux'

const Filename = ({ project }) => {
    const { classes }             = useStyles()
    const [editName, setEditName] = useState(true)
    const [name, setName]         = useState("Project Name")
    let opacity                   = editName ? 1 : 0
    const inputRef                = React.createRef()

    function SetName() {
        let project_id = project.project_id
        if(project_id == "demo") {
            setName("Project Name")
            return
        }

        let project_name = project.project_name
        setName(project_name)
    }

    function ChangeName() {
        //get the ref
        let input = inputRef.current
        let val   = input.value

        setEditName(true)
    }

    useEffect(() => {
        SetName()
    }, [])
    
    useEffect(() => {
        SetName()
    }, [project])

    return (
        <div>
            <Group className={classes.filenameGroup}>
                <MdOutlineInsertDriveFile size={14} style={{ opacity: opacity }} />
                <Text style={{ opacity: opacity }} className={classes.folder}>Folder Name /</Text>

                {editName
                    ? <Text className={classes.file} onClick={() => { setEditName(false) }}>{name}</Text>
                    : (
                        <form onSubmit={() => { ChangeName() }}>
                            <Input
                                variant={"unstyled"}
                                defaultValue={"Project Name"}
                                autoFocus
                                onBlur={() => { setEditName(true) }}
                                ref={inputRef}
                            />
                        </form>
                    ) 
                }

                <BiChevronDown style={{ opacity: opacity }} size={14} />
            </Group>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({
    project: state.project
})

export default connect(mapStateToProps, mapDispatchToProps)(Filename)