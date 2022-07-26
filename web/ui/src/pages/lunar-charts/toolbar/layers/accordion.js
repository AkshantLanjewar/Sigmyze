import React, { useState } from 'react'
import { Accordion } from '@mantine/core'

const LayerAccordion = ({ items }) => {
    const [value, setValue] = useState('chart-elements')

    return (
        <Accordion
            variant={'filled'}
            chevronSize={28}
            chevronPosition={'right'}
            value={value}
            onChange={setValue}
            radius={'sm'}
        >   
            {items.map((step) => (
                <Accordion.Item value={step.id}>
                    <Accordion.Control>{step.title}</Accordion.Control>
                    <Accordion.Panel>{step.slot}</Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}

export default LayerAccordion