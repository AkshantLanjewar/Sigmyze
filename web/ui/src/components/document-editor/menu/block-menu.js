import React from 'react'

import {
    Box,
    ScrollArea
} from '@mantine/core'

import menuComponents from './menu-components'
import BlockItem from './block-itm'
import { BlockTitle } from './block-itm'

class BlockMenu extends React.Component {
    constructor(props) {
        super(props)

        this.componentDidMount  = this.componentDidMount.bind(this)
        this.keyDownHandler     = this.keyDownHandler.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)

        this.state = {
            command: "",

            items: [],

            selectedItem: 0,
            x: 0,
            y: 0
        }
    }

    componentDidMount() {
        let items       = []
        for(let i = 0; i < menuComponents.length; i++) {
            let component = menuComponents[i]
            if(component['type'] == 'Title')
                items.push(<BlockTitle label={component['title']} />)
            else
                items.push(
                    <BlockItem
                        icon={component['icon']}
                        name={component['fullname']}
                        id={component['id_name']}
                        updateBlockHandler={() => { this.props.updateBlockHandler(component['tag']) }}
                    />
                )
        }

        this.setState({ items: items })
        document.addEventListener("keydown", this.keyDownHandler)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDownHandler)
    }

    componentDidUpdate(prevProps, prevState) {
        const command   = this.state.command
        let title_nodes = 0

        if(prevState.command !== command) {
            let items = []
            for(let i = 0; i < menuComponents.length; i++) {
                let component = menuComponents[i]
                if(component['type'] == 'Title')
                    items.push(<BlockTitle label={component['title']} type={'title'} />)

                if('id_name' in component) {
                    let item_id = component['id_name'].slice(0, command.length)
                    if(item_id == command)
                        items.push(
                            <BlockItem
                                icon={component['icon']}
                                name={component['fullname']}
                                id={component['id_name']}
                                updateBlockHandler={() => { this.props.updateBlockHandler(component['tag']) }}
                            />
                        )
                }
            }

            this.setState({ items: items })
        }
    }

    keyDownHandler(e) {
        const items    = this.state.items
        const selected = this.state.selectedItem
        const command  = this.state.command

        switch(e.key) {
            case "Enter":
                e.preventDefault()
                
                let item_props = items[selected].props
                let item_id    = item_props['id']
                let component  = null

                for(let i = 0; i < menuComponents.length; i++) {
                    let m_component = menuComponents[i]
                    if(m_component['id_name'] == item_id)
                        component = m_component
                }

                if(component == null)
                    return

                this.props.updateBlockHandler(component['tag'])
                break
            case "Backspace":
                if(!command) this.props.closeMenuHandler()
                this.setState({ command: command.substring(0, command.length - 1) })
                break
            case "ArrowUp":
                e.preventDefault()
                const prevSelected = selected === 0 ? items.length - 1 : selected - 1
                this.setState({ selectedItem: prevSelected })
                break
            case "ArrowDown":
            case "Tab":
                e.preventDefault()
                const nextSelected = selected === items.length - 1 ? 0 : selected + 1
                this.setState({ selectedItem: nextSelected })
                break
            default:
                if(!e.ctrlKey && !e.metaKey && !e.altKey && e.which != 8)
                    this.setState({ command: this.state.command + e.key })
                break
        }
    }

    render() {
        return (
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    top: `${this.props.pos.y}px`,
                    left: `${this.props.pos.x + 5}px`,

                    backgroundColor: theme.colors.dark[9],
                    borderRadius: theme.radius.sm,
                    width: 250,
                    minHeight: 200,
                    zIndex: 99,

                    paddingLeft: theme.spacing.xs,
                    paddingRight: theme.spacing.xs,
                    paddingTop: theme.spacing.xs,
                    paddingBottom: theme.spacing.xs,

                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5
                })} 
            >
                <ScrollArea
                    sx={{ height: 270 }} 
                    offsetScrollbars
                >
                    {this.state.items.map((step, key) => {
                        let clone = React.cloneElement(step, { key: `${key}-ppsad`, selected: key == this.state.selectedItem })
                        return clone
                    })}
                </ScrollArea>
            </Box>
        )
    }
}

export default BlockMenu