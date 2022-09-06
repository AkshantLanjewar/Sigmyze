import React from 'react'

import { Box, Input }     from '@mantine/core'
import { useForm }        from '@mantine/form'

import { parseTpl } from '../../../../lib'

import { MdOutlineTitle } from 'react-icons/md'

const ChartText = ({ title, description, selected, ParseText }) => {
    const form = useForm({
        initialValues: {
            title: title,
            description: description
        }
    })

    function generateIndicators() {
        let str = ''
        for(let i = 0; i < selected.length; i++) {
            let indicator     = selected[i].indicator
            let indicator_str = `${indicator['object_id']}_${indicator['indicator_id']}`
            str              += indicator_str + ','
        }

        return str.slice(0, -1)
    }

    function onChange(e, type) {
        let text           = e.currentTarget.value
        let indicator_text = generateIndicators()
        let parsed_text    = parseTpl(text, { indicators: indicator_text })

        if(type == "title")
            form.setValues('title', text)
        if(type == "description")
            form.setValues('description', text)
        ParseText(parsed_text, type)
    }

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
                    onChange={(e) => { onChange(e, "title") }}
                    value={form.values.title}
                />

                <Input
                    mt={'lg'}
                    variant='filled'
                    placeholder='Your Description'
                    icon={<MdOutlineTitle size={14} />}
                    onChange={(e) => { onChange(e, "description") }}
                    value={form.values.description}
                />
            </form>
        </Box>
    )
}

export default ChartText