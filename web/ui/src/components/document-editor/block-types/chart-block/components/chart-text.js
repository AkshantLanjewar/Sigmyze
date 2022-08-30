import React from 'react'

import { Box, Input }     from '@mantine/core'
import { useForm }        from '@mantine/form'

import { MdOutlineTitle } from 'react-icons/md'

const ChartText = ({ title, description, ParseText }) => {
    const form = useForm({
        initialValues: {
            title: title,
            description: description
        }
    })

    return (
        <Box 
            mt={'xl'}
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 350,
                margin: '0 auto',
                gap: 10
            }}
        >
            <form onSubmit={(e) => { e.preventDefault() }}>
                <Input
                    variant='filled'
                    placeholder='Your Title'
                    icon={<MdOutlineTitle size={14} />}
                    {...form.getInputProps('title')}
                />

                <Input
                    mt={'lg'}
                    variant='filled'
                    placeholder='Your Description'
                    icon={<MdOutlineTitle size={14} />}
                    {...form.getInputProps('description')}
                />
            </form>
        </Box>
    )
}

export default ChartText