import React from 'react'

import {
    TextInput,
} from "@mantine/core"

import { AiOutlineSearch } from 'react-icons/ai'

import useStyles from './country-search.styles'

const CountrySearch = ({ }) => {
    const { classes } = useStyles()

    return (
        <TextInput
            mt={"xl"}
            radius={"sm"}
            size="md"
            placeholder='Search Indicators ...'
            className={classes.input}
            icon={ <AiOutlineSearch size={18} /> }
        />
    )
}

export default CountrySearch