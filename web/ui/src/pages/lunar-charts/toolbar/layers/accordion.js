import React, { useState, useHov } from 'react'

import { BsThreeDots } from 'react-icons/bs'
import { BiCheck, BiChevronDown } from 'react-icons/bi'

import {
    Box,
    Menu,
    ActionIcon,
    Text,
    Tooltip,
    UnstyledButton,
    Collapse 
} from '@mantine/core'

import { MdLibraryAdd } from 'react-icons/md'

const AccordionItem = ({ id, title, slot, setOpenAdd }) => {
    const [active, setActive] = useState(true)
    const [hover, setHover]   = useState(true)

    const ElementsMenu = (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <Tooltip
                withArrow
                position={'bottom-end'}
                label={'Add Indicator'}
            >
                <ActionIcon 
                    value={"side-ico"}
                    onClick={() => { setOpenAdd(true) }}
                >
                    <MdLibraryAdd 
                        aria-label='side-ico' 
                        size={16} 
                    />
                </ActionIcon>
            </Tooltip>
        </Box>
    )

    return (
        <Box>
            <UnstyledButton
                sx={(theme) => ({
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 12, 
                    paddingRight: 12,
                    width: '100%',
                    height: 54,
                    
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `2px solid ${theme.colors.dark[9]}`
                })}

                onClick={(e) => { 
                    let target = e.target.value
                    let tName  = e.target.tagName.toLowerCase()
                    let aria   = e.target.getAttribute('aria-label')

                    if(aria == 'side-ico')
                        return
                    if(target == 'side-ico')
                        return
                    if(tName == 'button' || tName == 'div' || tName == 'svg')
                        setActive(!active)
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BiChevronDown 
                        size={16} 
                        style={{ transform: `rotate(${ active ? '-180deg' : '0deg' })` }}
                    />

                    <Text 
                        size={'sm'} 
                        transform={'uppercase'} 
                        color={"dimmed"} 
                        weight={600}
                        ml={'sm'}
                    >
                        {title}
                    </Text>  
                </Box>

                <Box>
                    {id == 'chart-indicators' ? (<div>{ElementsMenu}</div>) : null}
                </Box>
            </UnstyledButton>

            <Collapse 
                in={active}
                sx={{ 
                    paddingLeft: 16, 
                    paddingRight: 16, 
                    paddingTop: 12, 
                    paddingBottom: 4 
                }}
            >
                {slot}
            </Collapse>
        </Box>
    )
}

const Accordion = ({ items, setOpenAdd }) => {
    return (
        <Box>
            {items.map((step) => (
                <AccordionItem 
                    id={step.id}
                    title={step.title}
                    slot={step.slot}
                    setOpenAdd={setOpenAdd}
                />
            ))}
        </Box>
    )
}

const LayerAccordion = ({ items, setOpenAdd }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingLeft: 12,
                    marginTop: 8 
                }}
            >
                <Text 
                    color={'dimmed'} 
                    transform={'uppercase'} 
                    size={'xs'} 
                    weight={400}
                >
                    Explorer
                </Text>

                <Menu
                    shadow={"md"}
                    withArrow 
                    position={'bottom-start'} 
                    width={200}
                >
                    <Menu.Target>
                        <ActionIcon
                            size={'md'}
                            color={'gray'}
                            mr={'sm'}
                        >
                            <BsThreeDots />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {items.map((step) => (
                            <Menu.Item
                                icon={<BiCheck size={18} />}
                                disabled={step.id == 'chart-indicators'}
                            >
                                {step.title}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </Box>

            <Accordion items={items} setOpenAdd={setOpenAdd} />
        </Box>
    )
}

export default LayerAccordion