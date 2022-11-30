import React, { useState } from 'react'

import { 
    TextInput, 
    createStyles 
} from '@mantine/core'

const useStyles = createStyles((theme, { floating }) => ({
    root: {
        position: 'relative'
    },

    label: {
        position: 'absolute',
        zIndex: 2,
        top: 7,
        left: theme.spacing.md + 16,
        pointerEvents: 'none',
        color: floating ? theme.white : theme.colors.gray[3],
        transition: 'transform 150ms ease, color 150ms ease, font-size 150ms ease',
        transform: floating ? `translate(-${theme.spacing.sm}px, -28px)` : 'none',
        fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
        fontWeight: floating ? 500 : 400,
    },

    required: {
        transition: 'opacity 150ms ease',
        opacity: floating ? 1 : 0
    },

    input: {
        '&::placeholder': {
            transition: 'color 150ms ease',
            color: !floating ? 'transparent' : undefined,
        }
    }
}))

const PublishingField = ({ icon, label, form, name }) => {
    const [focused, setFocused] = useState(false)
    const [value, setValue]     = useState('')
    const { classes }           = useStyles({ floating: focused || value.trim().length !== 0 })

    return (
        <TextInput
            label={label}
            required
            icon={icon}
            classNames={classes}
            value={value}
            mt={"xl"}
            autoComplete={"nope"}
            onFocus={ () => { setFocused(true) } }
            onBlur={ () => { setFocused(false) } }
            onChange={ (event) => {
                setValue(event.currentTarget.value)
                form.setFieldValue(name, event.currentTarget.value)
            }}
        />
    )
}

export default PublishingField