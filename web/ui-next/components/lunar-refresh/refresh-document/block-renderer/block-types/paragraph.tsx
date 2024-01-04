import { useClickOutside } from "@mantine/hooks"
import { useEffect, useRef, useState } from "react"
import { INoteBlock } from "../../types"
import styles from './index.module.scss'
import { ActionIcon, Text } from "@mantine/core"
import { IconGripVertical } from "@tabler/icons"

interface INoteParagraphProps {
    /**
     * This is the block that is being rendered
     */
    block: INoteBlock,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * Whether or not it is the endblock
     */
    endblock: boolean,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean
}

const NoteParagraph: React.FC<INoteParagraphProps> = ({ block, hasRequest, endblock, updateNoteBlock, consumeFocusRequest }) => {
    //this is the ref for the paragraph component
    const editableRef = useRef<HTMLParagraphElement>(null)

    //this is the click outside ref
    const ref = useClickOutside(() => {
        let element = editableRef.current
        if(element === null)
            return

        element.blur()
    })

    //this is the internal buffer for all changes that need to be applied
    const [buffer, setBuffer] = useState<string | undefined | null>(undefined)

    //this is the switch to flush the buffer when it is done
    const [flush, setFlush] = useState<boolean>(false)

    //this is whether or not the block is focused, used to display things such as the grip handle
    const [active, setActive] = useState<boolean>(false)

    //whether or not to display the flavor text
    const [flavor, setFlavor] = useState<boolean>(false)

    //this is the effect that flushes the buffer and updates the block content
    useEffect(() => {
        let uploadContent = buffer
        if(uploadContent === undefined)
            return
        if(uploadContent === null)
            uploadContent = ""

        updateNoteBlock(block.blockId, uploadContent)
        setBuffer(undefined)
    }, [flush])

    //this is the effect that consumes a hasRequest effect
    useEffect(() => {
        if(hasRequest !== true || editableRef.current === null)
            return
        if(consumeFocusRequest(block.blockId) === false)
            return

        editableRef.current.focus()

        //move selection to the end of the element
        const range = document.createRange()
        const selection = window.getSelection()

        range.setStart(editableRef.current, editableRef.current.childNodes.length)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
    }, [hasRequest])

    //this is the effect that determines whether the flavor string should be displayed or the block content
    useEffect(() => {
        setFlavor(false)
        if(endblock === false || active === true || block.blockContent.length > 0)
            return

        setFlavor(true)
    }, [block, endblock, active])

    return (
        <div 
            ref={ref}
            className={styles.block__container}
        >
            <ActionIcon
                variant={"subtle"}
                size={"sm"}
                color={"gray"}
                ml={-26}
                data-testId={"drag-handle"}
                style={{ 
                    opacity: active ? 1 : 0,
                    transition: "opacity 50ms linear" 
                }}
            >
                <IconGripVertical style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
            
            <div data-testId={"block-content"}>
                <p
                    ref={editableRef}
                    contentEditable={true}
                    className={styles.block__paragraph}
                    style={{ color: flavor ? "#C1C2C5" : "#5C5F66" }}
                    onInput={e => setBuffer(e.currentTarget.textContent?.trim())}
                    onFocus={() => setActive(true)}
                    onBlur={() => {
                        setActive(false)
                        setFlush(!flush)
                    }}
                >
                    {flavor
                        ? "type ! for more options"
                        : block.blockContent
                    }
                </p>
            </div>
        </div>
    )
}

export { NoteParagraph }