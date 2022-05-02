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

import { GetCountries } from '../../../data/backend/datasets'

async function FetchCountries(dataset) {
    let countries = await GetCountries(dataset)
    countries     = countries['countries']
    console.log(countries)
}

const CountrySearch = ({ dataset = "weo" }) => {
    const { classes } = useStyles()
    const [opened, setOpened] = useState(false)

    async function main() {
        FetchCountries(dataset)
    }

    useEffect(() => {
        main()
    }, [])

    return (
        <div>
            <UnstyledButton className={classes.search} onClick={() => { setOpened(true) }}>
                <Group>
                    <img width={24} height={24} src={`${process.env.PUBLIC_URL}/country/us.svg`} />
                    <Text>United States of America</Text>
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
                />

                <div>
                    <div className={classes.countries}>
                        <ScrollArea style={{ height: "55vh" }}>
                            <Stack style={{ gap: 0 }}>
                                <UnstyledButton className={classes.country}>
                                    <Group align={"center"}>
                                        <img width={32} height={32} src={`${process.env.PUBLIC_URL}/country/us.svg`} />
                                        <Text size={"lg"}>United States of America</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton className={classes.country}>
                                    <Group align={"center"}>
                                        <img width={32} height={32} src={`${process.env.PUBLIC_URL}/country/us.svg`} />
                                        <Text size={"lg"}>United States of America</Text>
                                    </Group>
                                </UnstyledButton>
                            </Stack>
                        </ScrollArea>

                        <Group position={"center"} mb={"md"}>
                            <Button disabled>Submit</Button>
                        </Group>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CountrySearch