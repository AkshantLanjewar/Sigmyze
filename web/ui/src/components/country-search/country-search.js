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

const CountrySearch = ({ dataset = "weo", countries = [], setActiveC }) => {
    const { classes, cx } = useStyles()
    const inputRef    = React.createRef()

    const [opened, setOpened]             = useState(false)
    const [countries_v, setCountries]     = useState(countries)
    const [countries_d, setCountries_D]   = useState(countries)
    const [selected, setSelected]         = useState({ value: false, country: {  } })

    function Reset() {
        setCountries([...countries])
        setCountries_D([...countries])
    }

    useEffect(() => {
        //find the united states
        let country = {}
        for(let i = 0; i < countries.length; i++) {
            let c = countries[i]
            if(c.iso3 == "USA")
                country = c
        }

        Reset()
        setSelected({ value: false, country: country })
        if(countries.length != 0)
            setActiveC(country)
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

            let step = countries_d[i]
            let sub  = step.name.substring(0, word.length).toLowerCase()

            if(word == sub)
                steps.push(step)
        }

        setCountries([...steps])
    }

    function onCountryClick(iso2) {
        let steps = []
        let c     = {}

        for(let i = 0; i < countries_d.length; i++) {
            let country = countries[i]
            country['active'] = false
            if(country['iso2'] == iso2) {
                country['active'] = true
                c = country
            }

            steps.push(country)
        }

        setCountries_D([...steps])
        setSelected({ value: true, country: c })
        onKeyUp()
    }

    function Submit() {
        let country = selected.country
        if(setActiveC !== undefined)
            setActiveC(country)
        setOpened(false)
    }

    return (
        <div>
            <UnstyledButton className={classes.search} onClick={() => { setOpened(true) }}>
                <Group>
                    <img width={24} height={16} src={selected.country.logo} />
                    <Text size={"md"}>{selected.country.name}</Text>
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
                    placeholder='Search Countries'
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
                                        key={`${step.iso2}`} 
                                        onClick={() => { onCountryClick(step.iso2) }}
                                    >
                                        <Group align={"center"}>
                                            <img width={24} height={16} src={step.logo} />
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