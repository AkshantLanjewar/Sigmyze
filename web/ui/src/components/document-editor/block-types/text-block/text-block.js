import React from 'react'

import BlockMenu       from '../../menu/block-menu'
import { Box }         from '@mantine/core'
import ContentEditable from "react-contenteditable"

import TextHandle from './text-handle'

import { GenerateBaseStyles } from '../../document-styles'

import './text-style.scss' 

function getCaretCoordinates(el) {
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
                y = rect.top - window.scrollY
            }
        }
    }

    return { x: x, y: y }
}

const setCaretToEnd = (el, pos) => {
    el.focus()

    const node  = el.firstChild
    const range = document.createRange()
    
    range.setStart(node, pos)
    range.setEnd(node, pos)
    
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
}

const CMD_KEY     = '/'
const DEFAULT_VAL = 'Type / for more options'

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
        this.onFocus               = this.onFocus.bind(this)
        this.onBlur                = this.onBlur.bind(this)

        //helper setting
        this.updateAlign   = this.updateAlign.bind(this)
        this.focusInput    = this.focusInput.bind(this)
        this.collectStyles = this.collectStyles.bind(this)
        this.setStyles     = this.setStyles.bind(this)

        this.contentEditable = React.createRef()
        this.state = {
            html: DEFAULT_VAL,
            tag: "p",
            empty: true,

            backup: "",
            prevKey: "",
            menuOpen: false,
            x: 0,
            y: 0,

            focused: false,

            align: "left"
        }
    }

    componentDidMount() {
        if(this.props.created) 
            this.focusInput()

        let styles = this.props.styles
        if(styles !== undefined)
            this.setStyles()

        if(this.props.html.replace('\n', '').length == 0 && !this.props.created)
            this.setState({ html: DEFAULT_VAL, empty: true, tag: this.props.tag })
        else
            this.setState({ html: this.props.html, empty: false, tag: this.props.tag })
    }

    componentDidUpdate(prevProps, prevState) {
        let tag          = this.props.tag
        let created      = this.props.created
        let collect_flag = this.props.collect_flag    
        
        let styles     = this.props.styles
        let prevStyles = prevProps.styles
        if(styles !== prevStyles)
            this.setStyles()

        if(prevProps.tag !== tag) {
            this.setState({ html: this.props.html, tag: this.props.tag }, () => {
                let length = this.contentEditable.current.innerText.replace('\n', '').length

                this.closeMenuHandler()
                setCaretToEnd(this.contentEditable.current, length)
                this.focusInput()
            })
        }

        if(created !== prevProps.created) {
            if(created)
                this.contentEditable.current.focus()
        }
    }

    collectStyles() {
        let styles        = GenerateBaseStyles()
        styles['justify'] = this.state.align

        return styles
    }

    setStyles() {
        let styles = this.props.styles
        if(styles == undefined)
            return

        let align  = styles['justify']

        this.setState({ align: align })
    }

    focusInput() {
        this.contentEditable.current.focus()
        this.contentEditable.current.click()
    }

    onChangeHandler(e) {
        this.setState({ html: e.target.value })
    }

    onKeyDownHandler(e) {  
        let id = this.props.id    

        if(e.key == CMD_KEY)
            this.setState({ backup: this.state.html })
        if(e.key === "Enter" && this.state.prevKey !== "Shift" && !this.state.menuOpen) {
            e.preventDefault()
            this.props.setFocus(false)
            this.props.CreateBlock(id)
        }
        if(e.key == "Backspace" && ( !this.state.html || this.state.html === "<br>" )) {
            e.preventDefault()
            this.props.DeleteBlock(id)
        }

        this.setState({ prevKey: e.key })
    }

    onKeyUpHandler(e) {
        if(this.state.menuOpen) {
            let caretPos = getCaretCoordinates(this.contentEditable.current)
            this.setState({ x: caretPos.x, y: caretPos.y })
        }

        if(e.key === CMD_KEY)
            this.openSelectMenuHandler()
    }

    openSelectMenuHandler() {
        let caretPos = getCaretCoordinates(this.contentEditable.current)
        this.setState({ menuOpen: true, x: caretPos.x, y: caretPos.y })
        document.addEventListener("click", this.closeMenuHandler)
    }

    closeMenuHandler() {
        this.setState({ menuOpen: false, backup: null })
        document.removeEventListener("click", this.closeMenuHandler)
    }

    onFocus() {
        let length = this.contentEditable.current.innerText.replace('\n', '').length
        setCaretToEnd(this.contentEditable.current, length)

        this.focusInput()
        if(this.state.empty && this.state.html == DEFAULT_VAL)
            this.setState({ empty: false, html: "" })
    }

    onBlur() {
        this.updateBlockHandler(this.props.tag) 

        let length = this.contentEditable.current.innerText.replace('\n', '').length
        if(length == 0)
            this.setState({ empty: true, html: DEFAULT_VAL })
    }

    updateBlockHandler(tag) {
        let id   = this.props.id
        let html = this.state.menuOpen ? this.state.backup : this.state.html 

        let styles = this.collectStyles()

        this.contentEditable.current.blur()
        this.props.UpdateNode(id, tag, { text: html }, styles)
    }

    updateAlign(newAlign) {
        this.setState({ align: newAlign }, () => {
            this.updateBlockHandler(this.state.tag)
        })
    }

    render() {
        return (
            <Box
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start' ,
                    flexGrow: 1,
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

                <Box sx={{ position: 'relative' }}>
                    <ContentEditable
                        html={this.state.html}
                        tagName={this.state.tag}
                        innerRef={this.contentEditable}
                        onChange={this.onChangeHandler}
                        onKeyDown={this.onKeyDownHandler}
                        onKeyUp={this.onKeyUpHandler}

                        style={{
                            fontStyle: this.state.empty ? 'italic' : 'normal',
                            color: this.state.empty ? '#A6A7AB' : 'inherit',
                            textAlign: this.state.align
                        }}

                        onFocus={this.onFocus}
                        onBlur={this.onBlur}                    
                        className={"text-node"}
                    />

                    <TextHandle 
                        focused={this.props.focus} 
                        updateAlign={this.updateAlign}
                    />
                </Box>
            </Box>
        )
    }
}

export default TextBlock