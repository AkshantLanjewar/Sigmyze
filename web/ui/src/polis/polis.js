import React, { useState, useEffect } from 'react'

import { Box } from '@mantine/core'

const Polis = ({ polis_id }) => {
    const [polis, setPolis] = useState(null)

    useEffect(() => {
        let url = `/api/v1/polis/get/${polis_id}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if('error' in data)
                    return
                
            })
    }, [])

    return (
        <Box>

        </Box>
    )
}

export default Polis