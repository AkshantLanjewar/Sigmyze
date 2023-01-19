import { IDocumentBlock } from "../../../../data/lunar/document-types"
import { Text, Group, ActionIcon, Title } from '@mantine/core'
import { IconGripVertical } from "@tabler/icons"
import styles from './text-block.module.scss'
import { useHover, usePrevious } from "@mantine/hooks"
import { useState, FocusEvent, useRef, useEffect, KeyboardEvent, MouseEvent } from "react"
import { v4 } from "uuid"

import { 
    ParseContentInput,
    ConvertToInput, 
    placeCaretAtEnd, 
    getCaretCoordinates, 
    SanitizeHTML, 
    SafeReplaceHTML, 
    ExtractSaved
} from "../utils"

import { 
    createBlock, 
    deleteBlock, 
    inputActiveState, 
    inputValueState, 
    menuPosState, 
    oldInput, 
    setLastActive, 
    updateBlock,
    closeMenuState, 
    inputIdState
} from "../../document-editor"
import { TitleOrder } from "@mantine/core/lib/Title"

interface IParagraphBlockProps {
    block: IDocumentBlock,
    index: number,
    createBlock?: createBlock,
    updateBlock?: updateBlock,
    deleteBlock?: deleteBlock,
    setLastActive?: setLastActive,
    autoFocus?: boolean,
    oldInput: oldInput,
    inputActiveState: inputActiveState,
    inputValueState: inputValueState,
    menuPosState: menuPosState,
    closeMenuState: closeMenuState,
    inputIdState: inputIdState,
    resetInternalBlock?: () => void,
    moveFocus: (id: string, direction: "up" | "down") => void
}

const TextBlock: React.FC<IParagraphBlockProps> = 
({ 
    block, 
    createBlock, 
    updateBlock, 
    index, 
    autoFocus, 
    deleteBlock, 
    setLastActive, 
    oldInput,
    inputActiveState,
    inputValueState,
    menuPosState,
    closeMenuState,
    inputIdState,
    resetInternalBlock,
    moveFocus 
}) => {
    const [active, setActive] = useState(false)
    const [oldWithSlash, setOldWithSlash] = useState<string | null>(null)
    const [useSlash, setUseSlash] = useState(false)
    const [order, setOrder] = useState<TitleOrder>(1)
    const [blockType, setBlockType] = useState<string | null>(null)
    const [cursorSelection, setCursorSelection] = useState<(number | Node | null)[] | undefined>(undefined)

    const { hovered, ref } = useHover()
    const textRef = useRef<HTMLDivElement>(null)
    const prevType = usePrevious(blockType)
    const prevOrder = usePrevious(order)

    const { oldInputValue, setOldInputValue } = oldInput
    const { inputActive, setInputActive } = inputActiveState
    const { inputValue, setInputValue } = inputValueState
    const { menuPos, setMenuPos } = menuPosState
    const { closeMenuFlag, setCloseMenuFlag } = closeMenuState
    const { inputId, setInputId } = inputIdState 

    //effects hook
    useEffect(() => {
        let textElem = textRef.current
        if(textElem === null)
            return

        let textNodes = block.textNodes
        if(textNodes === undefined)
            return

        let output = ConvertToInput(textNodes)
    }, [])

    useEffect(() => {
        let textNodes = block.textNodes
        if(textNodes === undefined)
            return
        if(textRef.current === null)
            return
        
        let output = ConvertToInput(textNodes)
        if(inputActive === false)
            SafeReplaceHTML(textRef.current, output)
    }, [block])

    //sets the block type
    useEffect(() => {
        setBlockType(block.type)
    }, [block.type])

    //sets the block order
    useEffect(() => {
        if(block.order === undefined)
            return

        setOrder(block.order)
    }, [block.order])

    //handles the changing of type and order
    useEffect(() => {
        if(textRef.current === null)
            return
        if(block.textNodes === undefined)
            return      
        
        let output = ConvertToInput(block.textNodes)
        SafeReplaceHTML(textRef.current, output)
            
        if(blockType === null)
            return
        if(prevType === null || prevType === undefined)
            return
        if(blockType === "title" && prevOrder === undefined)
            return

        let changed = false
        if(prevOrder !== undefined && prevOrder !== order)
            changed = true
        if(prevType !== blockType)
            changed = true
        
        if((changed === true && autoFocus === true) || active) {
            textRef.current.focus()
            let currentSelection = ExtractSaved()
            if(cursorSelection === undefined || currentSelection === undefined)
                return
            if(cursorSelection[1] === undefined)
                return

            const selection = document.getSelection()
            try {
                selection?.collapse(currentSelection[0] as Node | null, cursorSelection[1] as number)
            } catch(error) {
                placeCaretAtEnd(textRef.current)
            }
        }
    }, [order, blockType])

    //handles focus
    useEffect(() => {
        if(textRef.current === null)
            return

        if(autoFocus === false)
            textRef.current.blur()
        if(autoFocus === true) {
            textRef.current.focus()
            placeCaretAtEnd(textRef.current)
        }
    }, [autoFocus])

    //checks for leaf
    useEffect(() => {
        if(block.leaf !== true)
            return
        if(textRef.current === null)
            return

        if(active === false)
            SafeReplaceHTML(textRef.current, "Type / for a list of commands")
    })

    //handles the closing of the menu flag
    useEffect(() => {
        if(textRef.current === null)
            return
        if(oldInputValue === null)
            return
        if(block.id !== inputId)
            return

        //output
        let tNodes = block.textNodes
        if(tNodes !== undefined) {
            let output = ConvertToInput(tNodes)
            
            if(useSlash === true && oldWithSlash !== null) {
                output = oldWithSlash
                if(inputValue.trim().length > 0)
                    output = oldInputValue.trim()
            }

            SafeReplaceHTML(textRef.current, output)
        }

        setOldInputValue(null)
        setOldWithSlash(null)
        setUseSlash(false)
        setInputValue("")
        setInputActive(false)
        setMenuPos({ x: 0, y: 0 })
        setInputId(null)

        let currentSelection = ExtractSaved()
        if(cursorSelection === undefined || currentSelection === undefined)
            return
        if(cursorSelection[1] === undefined)
            return
        
        try {
            const selection = document.getSelection()
            let offset = cursorSelection[1] as number
            if(useSlash && oldWithSlash !== null && inputValue.length === 0)
                offset += 1

            selection?.collapse(currentSelection[0] as Node | null, offset)
        } catch {
            placeCaretAtEnd(textRef.current)
        }
    }, [closeMenuFlag])

    function resetInput() {
        setCloseMenuFlag(!closeMenuFlag)
    }

    //event handlers

    function focus(e: FocusEvent<HTMLDivElement, Element>) {
        //clear the text
        if(textRef.current === null)
            return
        if(block.leaf === true)
            textRef.current.innerText = ""

        setActive(true)
    }

    function blur(e: FocusEvent<HTMLDivElement, Element>) {
        //set it back to leaf
        if(textRef.current === null)
            return

        let leaf = block.leaf
        let text = textRef.current.innerHTML
        let textTest = textRef.current.innerText.trim()

        if(leaf === true)
            textRef.current.innerText = "Type / for a list of commands"
        setActive(false)
        
        let parsedOutput = ParseContentInput(text)
        if(leaf === true) {
            let nBlock = {
                type: block.type,
                textNodes: parsedOutput,
                id: v4()
            } as IDocumentBlock

            if(createBlock === undefined)
                return
            if(resetInternalBlock === undefined)
                return
            if(textTest.length === 0) {
                resetInternalBlock()
                return
            }

            if(inputActive === false)
                createBlock(nBlock, index)
            resetInternalBlock()
        } else {
            //update the block
            let nBlock = block
            block.textNodes = parsedOutput
            block.autoFocus = false

            if(updateBlock === undefined)
                return
            if(inputActive === true)
                return
            updateBlock(nBlock)
        }
    }

    //used for moving the menu box around
    function onKeyUp(e: KeyboardEvent<HTMLDivElement>) {
        let key = e.key

        if(inputActive === false)
            return
        if(key === "Backspace" && inputValue.length === 0)
            return
        if(key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === "ArrowLeft" || key === "ArrowRight")
            return

        let pos = getCaretCoordinates()
        setMenuPos({ ...pos })
    }

    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        let key = e.key
        if(deleteBlock === undefined)
            return
        if(textRef.current === null)
            return
        if(updateBlock === undefined)
            return

        //activeates the menu
        if(key === "/" && inputActive === false) {
            let oldVal = textRef.current.innerHTML.trim()
            if(oldVal[oldVal.length - 1] === ">")
                oldVal += " "

            //caret selection
            let selection = ExtractSaved()
            setCursorSelection(selection)
            //caret xy pos
            let pos = getCaretCoordinates()
            setMenuPos({ ...pos })

            setOldInputValue(oldVal)
            setOldWithSlash(SanitizeHTML(textRef.current.innerHTML + "/"))
            setInputActive(true)
            setInputId(block.id)

            let parsedOutput = ParseContentInput(oldVal)
            let nBlock = block
            nBlock.textNodes = parsedOutput
            updateBlock(nBlock)

            return
        }

        //declines the menu if space is pressed
        if(key === " " && inputActive === true) {
            if(oldInputValue === null)
                return
            e.preventDefault()

            setUseSlash(true)
            resetInput()
            return
        }

        //input active events
        if(inputActive === true) {
            if(key === "Backspace" && inputValue.length === 0) {
                e.preventDefault()
                resetInput()
                return
            }

            //theese are the cases we dont want to deal with
            if(key === "ArrowDown" || key === "ArrowUp" || key === "Enter") {
                e.preventDefault()
                return
            }

            if(key === "ArrowRight")
                return
            if(key === "ArrowLeft")
                return

            let stringKey = key.toString()
            if(key === 'Control')
                stringKey = ''
            if(key === 'Shift')
                stringKey = ''

            //delete or add member to input value
            if(key === "Backspace" && e.ctrlKey) {
                setInputValue("")
                return
            }

            if(key === "Backspace")
                setInputValue(inputValue.substring(0, inputValue.length - 1))
            else
                setInputValue(inputValue + stringKey)
        }

        //deletes the block if empty
        //moves to last block if the leaf
        if(key === "Backspace" && textRef.current?.innerText.trim().length === 0 && block.leaf !== true) {
            e.preventDefault()
            deleteBlock(block.id)
            return
        } else if (key === "Backspace" && textRef.current?.innerText.trim().length === 0 && block.leaf === true) {
            e.preventDefault()
            if(setLastActive !== undefined)
                setLastActive()
            return
        }

        //move focus up one node
        if(key === "ArrowUp" && inputActive === false) {
            e.preventDefault()
            moveFocus(block.id, "up")
            return
        }

        //move focus down one node
        if(key === "ArrowDown" && inputActive === false) {
            e.preventDefault()
            moveFocus(block.id, "down")
            return
        }

        //enter key when input not active
        if(key === "Enter" && inputActive === false) {
            e.preventDefault()
            let nBlock = {
                type: "paragraph",
                textNodes: [],
                id: v4(),
                leaf: false
            } as IDocumentBlock

            if(createBlock === undefined)
                return
            if(resetInternalBlock === undefined)
                return

            if(block.leaf === true) {
                let text = textRef.current?.innerHTML
                if(text === undefined)
                    return

                let parsedOutput = ParseContentInput(text)
                nBlock.textNodes = parsedOutput
                nBlock.type = block.type
                nBlock.order = block.order

                createBlock(nBlock, index, false)

                //reset the leaf
                textRef.current!.innerHTML = ""
                textRef.current?.focus()
                resetInternalBlock()

                textRef.current?.focus()
            } else
                createBlock(nBlock, index + 1, true)
            return
        }
    }

    function onClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
        if(textRef.current === null)
            return
        if(inputActive === false) {
            textRef.current.focus()
            return
        }
        
        resetInput()
    }

    //styles

    let textStyles = {
        italic: "normal",
        color: "normal"
    }

    if(block.leaf === true) {
        if(active === false) {
            textStyles.italic = "italic" 
            textStyles.color = "dimmed"
        }
    }

    return (
        <div>
            <Group 
                noWrap={true}
                spacing={"xs"} 
                align={"center"} 
                ref={ref}
            >
                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: hovered || active ? 1 : 0 }}
                >
                    <IconGripVertical />
                </ActionIcon>

                {block.type === "paragraph" && (
                    <Text
                        contentEditable={true}
                        className={styles.paragraphBlock}
                        onFocus={e => focus(e)}
                        onBlur={e => blur(e)}
                        onKeyDown={e => onKeyDown(e)}
                        onKeyUp={e => onKeyUp(e)}
                        onClick={e => onClick(e)}
                        ref={textRef}
                        fs={textStyles.italic}
                        color={textStyles.color}
                        suppressContentEditableWarning={true}
                    >
                        {block.leaf === true && "Type / for a list of commands"}
                    </Text>  
                )}

                {block.type === "title" && (
                    <Title
                        order={order}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        className={styles.paragraphBlock}
                        onFocus={e => focus(e)}
                        onBlur={e => blur(e)}
                        onKeyDown={e => onKeyDown(e)}
                        onKeyUp={e => onKeyUp(e)}
                        onClick={e => onClick(e)}
                        ref={textRef}
                        fs={textStyles.italic}
                        color={textStyles.color}
                    />
                )}

                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: 0 }}
                />
            </Group>
        </div>
    )
}

export default TextBlock