import React, { useState, useEffect } from 'react'

import {
    UnstyledButton,
    Group,
    Text,
    Modal,
    TextInput,
    ScrollArea,
    Stack,
    Button
} from "@mantine/core"

import { AiOutlineSearch } from 'react-icons/ai'

import useStyles from './country-search.styles'

// code FEHK51ECLSNAVTZSWHKS5YHE

const CountrySearch = ({ dataset = "weo", objects = [], setActiveC }) => {
    const { classes, cx } = useStyles()
    const inputRef    = React.createRef()

    const [opened, setOpened]      = useState(false)
    const [objects_v, setObjects]  = useState(objects)
    const [objects_d, setObjectsD] = useState(objects)
    const [selected, setSelected]  = useState({ value: false, object: { logo: '', name: '' } })

    function reset() {
        setObjects([...objects])
        setObjectsD([...objects])
    }

    useEffect(() => {
        let defaultObject = objects[0]
        if(objects.length == 0)
            return

        reset()
        setSelected({ value: false, object: defaultObject })

        if(objects.length != 0)
            setActiveC(defaultObject)
    }, [objects])

    useEffect(() => {
        reset()
    }, [opened])

    function onKeyUp(e) {
        if(e !== undefined)
            e.preventDefault()
        let currentInput = inputRef.current.value.toLowerCase()

        let steps = []
        for(let i = 0; i < objects_d.length; i++) {
            let word = currentInput.split(" ")[currentInput.split(" ").length - 1]
            if(word == undefined)
                continue

            let step = objects_d[i]
            let sub  = step.name.substring(0, word.length).toLowerCase()
            if(word == sub)
                steps.push(step)
        }

        setObjects([...steps])
    }

    function onCountryClick(object_id) {
        let steps = []
        let c     = {}

        for(let i = 0; i < objects_d.length; i++) {
            let object = objects[i]
            object['active'] = false

            if(object['object_id'] == object_id) {
                object['active'] = true
                c = object
            }

            steps.push(object)
        }

        setObjectsD([...steps])
        setSelected({ value: true, object: c })
        onKeyUp()
    }

    function Submit() { 
        let object = selected.object
        
        if(setActiveC !== undefined)
            setActiveC(object)
        setOpened(false)
    }

    return (
        <div>
            <UnstyledButton className={classes.search} onClick={() => { setOpened(true) }}>
                <Group>
                    <img width={24} height={16} src={`data:image/svg+xml;base64,${selected.object.logo}`} />
                    <Text size={"md"}>{selected.object.name}</Text>
                </Group>
            </UnstyledButton>

            <Modal
                centered
                opened={opened}
                onClose={() => { setOpened(false) }}
                size={"lg"}
                withCloseButton={false}
                sx={(theme) => ({
                    '.mantine-Paper-root': {
                        padding: 0,
                        backgroundColor: theme.colors.dark[8]
                    }
                })}
            >
                <TextInput
                    placeholder='Search Objects in Dataset'
                    icon={<AiOutlineSearch size={18} />}
                    autoFocus
                    className={classes.input}
                    ref={inputRef}
                    onKeyUp={onKeyUp}
                />

                <div>
                    <div className={classes.countries}>
                        <ScrollArea style={{ height: "55vh" }}>
                            <Stack style={{ gap: 0 }}>
                                {objects_v.map((step) => (
                                    <UnstyledButton 
                                        className={cx(classes.country, { "active": step.active })} 
                                        key={`${step.object_id}`} 
                                        onClick={() => { onCountryClick(step.object_id) }}
                                    >
                                        <Group align={"center"}>
                                            <img width={24} height={16} src={`data:image/svg+xml;base64,${step.logo}`} />
                                            <Text size={"md"}>{step.object_fullname}</Text>
                                        </Group>
                                    </UnstyledButton>
                                ))}
                            </Stack>
                        </ScrollArea>

                        <Group position={"center"} mb={"md"}>
                            <Button disabled={!selected.value} onClick={Submit}>Submit</Button>
                        </Group>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CountrySearch