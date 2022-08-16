import React, { useState, useRef, useEffect }   from 'react'

import BlockMenu       from '../menu/block-menu'
import { Box }         from '@mantine/core'
import { useHover }    from '@mantine/hooks'
import ContentEditable from "react-contenteditable"

import './text-style.scss'

function getCaretCoordinates() {
    let x, y
    const isSupported = typeof window.getSelection !== 'undefined'

    if (isSupported) {
        const selection = window.getSelection()

        if (selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0).cloneRange()
            range.collapse(false)
            const rect = range.getClientRects()[0]

            if (rect) {
                x = rect.left
                y = rect.top
            }
        }
    }

    return { x: x, y: y }
}

const setCaretToEnd = (element, pos) => {
    const setPos = document.createRange()
    const set    = window.getSelection()

    setPos.setStart(element.childNodes[0], pos)
    setPos.collapse(true)
    set.removeAllRanges()
    set.addRange(setPos)

    element.focus()
}

const CMD_KEY = '/'

class TextBlock extends React.Component {
    constructor(props) {
        super(props)

        this.componentDidMount     = this.componentDidMount.bind(this)
        this.onChangeHandler       = this.onChangeHandler.bind(this)
        this.onKeyDownHandler      = this.onKeyDownHandler.bind(this)
        this.onKeyUpHandler        = this.onKeyUpHandler.bind(this)
        this.closeMenuHandler      = this.closeMenuHandler.bind(this)
        this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this)
        this.updateBlockHandler    = this.updateBlockHandler.bind(this)

        this.contentEditable = React.createRef()
        this.state = {
            html: "",
            tag: "p",

            backup: "",
            prevKey: "",
            menuOpen: false,
            x: 0,
            y: 0,

            focused: false
        }
    }

    componentDidMount() {
        this.setState({ html: this.props.html, tag: this.props.tag })
    }

    componentDidUpdate(prevProps, prevState) {
        let tag = this.props.tag
        if(prevProps.tag !== tag) {
            this.setState({ html: this.props.html, tag: this.props.tag }, () => {
                let length = this.contentEditable.current.innerText.length

                this.closeMenuHandler()
                setCaretToEnd(this.contentEditable.current, length - 1)
            })
        }
    }

    onChangeHandler(e) {
        this.setState({ html: e.target.value })
    }

    onKeyDownHandler(e) {        
        if(e.key == CMD_KEY)
            this.setState({ backup: this.state.html })
        if(e.key === "Enter" && this.state.prevKey !== "Shift" && !this.state.menuOpen) {
            e.preventDefault()
        }

        this.setState({ prevKey: e.key })
    }

    onKeyUpHandler(e) {
        if(this.state.menuOpen) {
            let caretPos = getCaretCoordinates()
            this.setState({ x: caretPos.x, y: caretPos.y })
        }

        if(e.key === CMD_KEY)
            this.openSelectMenuHandler()
    }

    openSelectMenuHandler() {
        let caretPos = getCaretCoordinates()
        this.setState({ menuOpen: true, x: caretPos.x, y: caretPos.y })
        document.addEventListener("click", this.closeMenuHandler)
    }

    closeMenuHandler() {
        this.setState({ menuOpen: false, backup: null })
        document.removeEventListener("click", this.closeMenuHandler)
    }

    updateBlockHandler(tag) {
        let id   = this.props.id
        let html = this.state.menuOpen ? this.state.backup : this.state.html 

        this.props.UpdateNode(id, tag, { text: html })
    }

    render() {
        return (
            <Box
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center' ,

                    flexGrow: 1
                }}
            >
                {this.state.menuOpen && (
                    <BlockMenu
                        opened={this.state.menuOpen}
                        closeMenuHandler={this.closeMenuHandler}
                        query={"query"}
                        updateBlockHandler={this.updateBlockHandler}
                        pos={{ x: this.state.x, y: this.state.y }}
                    />
                )}

                <ContentEditable
                    html={this.state.html}
                    tagName={this.state.tag}
                    innerRef={this.contentEditable}
                    onChange={this.onChangeHandler}
                    onKeyDown={this.onKeyDownHandler}
                    onKeyUp={this.onKeyUpHandler}
                    className={"text-node"}
                />
            </Box>
        )
    }
}

export default TextBlock