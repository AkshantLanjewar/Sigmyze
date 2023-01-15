import { IDocumentBlock } from "../../../data/lunar/document-types"
import { Text, Group, ActionIcon, SelectChevronIcon } from '@mantine/core'
import { IconGripVertical } from "@tabler/icons"
import styles from './text-block.module.scss'
import { useHover } from "@mantine/hooks"
import { useState, FocusEvent, useRef, useEffect, KeyboardEvent, MouseEvent } from "react"
import { ParseContentInput, ConvertToInput, placeCaretAtEnd, getCaretCoordinates } from "./utils"
import { v4 } from "uuid"
import { 
    createBlock, 
    deleteBlock, 
    inputActiveState, 
    inputValueState, 
    menuPosState, 
    oldInput, 
    setLastActive, 
    updateBlock 
} from "../document-editor"

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
    menuPosState: menuPosState
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
    menuPosState 
}) => {
    const [active, setActive] = useState(false)
    const { hovered, ref } = useHover()
    const textRef = useRef<HTMLDivElement>(null)

    const { oldInputValue, setOldInputValue } = oldInput
    const { inputActive, setInputActive } = inputActiveState
    const { inputValue, setInputValue } = inputValueState
    const { menuPos, setMenuPos } = menuPosState

    //effects hook
    useEffect(() => {
        let textElem = textRef.current
        if(textElem === null)
            return

        let textNodes = block.textNodes
        if(textNodes === undefined)
            return

        let output = ConvertToInput(textNodes)
        textElem.innerHTML = output
    }, [])

    useEffect(() => {
        let textNodes = block.textNodes
        if(textNodes === undefined)
            return
        
        let output = ConvertToInput(textNodes)
        textRef.current!.innerHTML = output
    }, [block])

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

    function resetInput() {
        if(textRef.current === null)
            return
        if(oldInputValue === null)
            return

        textRef.current.innerHTML = oldInputValue
        placeCaretAtEnd(textRef.current)

        setMenuPos({ x: 0, y: 0 })
        setInputActive(false)
        setInputValue("")
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
        let text = textRef.current.innerHTML.trim()
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
            if(textTest.length === 0)
                return
            createBlock(nBlock, index, false)
        } else {
            //update the block
            let nBlock = block
            block.textNodes = parsedOutput
            block.autoFocus = false

            if(updateBlock === undefined)
                return
            updateBlock(nBlock)
        }
    }

    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        let key = e.key
        if(deleteBlock === undefined)
            return

        if(key === "Enter") {
            e.preventDefault()
            let nBlock = {
                type: "paragraph",
                textNodes: [],
                id: v4()
            } as IDocumentBlock

            if(createBlock === undefined)
                return
            if(block.leaf === true) {
                let text = textRef.current?.innerHTML
                if(text === undefined)
                    return

                let parsedOutput = ParseContentInput(text)
                nBlock.textNodes = parsedOutput
                createBlock(nBlock, index, false)

                //reset the leaf
                textRef.current!.innerHTML = ""
                textRef.current?.focus()
            }
            else
                createBlock(nBlock, index + 1, true)
            return
        }

        if(key === "/" && inputActive === false) {
            if(textRef.current === null)
                return

            let pos = getCaretCoordinates()
            console.log(pos)
            setMenuPos({ ...pos })
            setOldInputValue(textRef.current.innerHTML)
            setInputActive(true)
            return
        }

        if(inputActive === true) {
            if(key === "Backspace" && inputValue.length === 0) {
                setMenuPos({ x: 0, y: 0 })
                setOldInputValue(null)
                setInputActive(false)
                return
            }

            if(key === "Backspace")
                setInputValue(inputValue.substring(0, inputValue.length - 1))
            else
                setInputValue(inputValue + key.toString())
        }

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
    }

    function onClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
        if(inputActive === true)
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

                <Text
                    contentEditable={true}
                    className={styles.paragraphBlock}
                    onFocus={e => focus(e)}
                    onBlur={e => blur(e)}
                    onKeyDown={e => onKeyDown(e)}
                    onClick={e => onClick(e)}
                    ref={textRef}
                    fs={textStyles.italic}
                    color={textStyles.color}
                    suppressContentEditableWarning={true}
                >
                    {block.leaf === true && "Type / for a list of commands"}
                </Text>

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