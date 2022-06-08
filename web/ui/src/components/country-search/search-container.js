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

const SearchContainer = ({ items = [], setActiveItem, defaultItem }) => {
    const { classes, cx } = useStyles()
    const inputRef    = React.createRef()

    const [opened, setOpened]       = useState(false)
    const [items_v, setItems_V]     = useState(items)
    const [items_d, setItems_D]     = useState(items)
    const [selected, setSelected]   = useState({ value: false, item: defaultItem })

    function Reset() {
        setItems_V([...items])
        setItems_D([...items])
    }

    useEffect(() => {
        Reset()
    }, [countries])

    useEffect(() => {
        Reset()
    }, [opened])

    function onKeyUp(e) {
        if(e !== undefined)
            e.preventDefault()
        let currentInput  = inputRef.current.value.toLowerCase()
        
        let steps = []
        for(let i = 0; i < countries_d.length; i++) {
            let word = currentInput.split(" ")[currentInput.split(" ").length - 1]
            if(word == undefined)
                continue

            let step = items_d[i]
            let sub  = step.name.substring(0, word.length).toLowerCase()

            if(word == sub)
                steps.push(step)
        }

        setItems_V([...steps])
    }

    function onItemClick(iso) {
        let steps = []
        let c     = {}

        for(let i = 0; i < items_d.length; i++) {
            let item       = items_d[i]
            item['active'] = false
            if(item['iso'] == iso) {
                item['active'] = true
                c = item
            }

            steps.push(item)
        }

        setItems_D([...steps])
        setSelected({ value: true, item: c })
        onKeyUp()
    }

    function Submit() {
        let item = selected.item
        if(setActiveItem !== undefined)
            setActiveItem(item)
        setOpened(false)
    }

    return (
        <div>
            <UnstyledButton className={classes.search} onClick={() => { setOpened(true) }}>
                <Group>
                    <img width={24} height={16} src={selected.item.logo} />
                    <Text size={"md"}>{selected.item.name}</Text>
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
                    placeholder='Search Datasets'
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
                                {countries_v.map((step) => (
                                    <UnstyledButton 
                                        className={cx(classes.country, { "active": step.active })} 
                                        key={`${step.short}`} 
                                        onClick={() => { onItemClick(step.short) }}
                                    >
                                        <Group align={"center"}>
                                            <img width={24} height={24} src={step.logo} />
                                            <Text size={"md"}>{step.name}</Text>
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