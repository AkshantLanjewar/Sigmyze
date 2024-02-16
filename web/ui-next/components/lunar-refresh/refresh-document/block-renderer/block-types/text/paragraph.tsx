import { useClickOutside } from "@mantine/hooks"
import { useCallback, useEffect, useRef, useState } from "react"
import { Blocks, IBlockStyles, INoteBlock } from "../../../types"
import styles from '../index.module.scss'
import { ActionIcon, Text } from "@mantine/core"
import { IconGripVertical } from "@tabler/icons"
import useTextCaptureHook from "../hooks/text-capture-hook"
import useTextBlock from "../hooks/text-block"
import useGrip from "../hooks/grip"
import ActionMenu from "../../action-menu"
import useTextGestures from "../hooks/text-gesture"
import useBlockStyles from "../hooks/styles"

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
     * Whether or not this block is the title block in a group
    */
    isTitleBlock?: boolean,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * This is the function that creates a focus request within the editor
     */
    createFocusRequest: (blockId: string) => void,

    /**
     * this is the function that groups a block within the editor
     */
    groupNoteBlock: (blockId: string) => void,

    /**
     * this is the function that appends a note block
     */
    appendNoteBlock: (blockId: string) => void,

    /**
     * This is the function that ungroups a block
     */
    ungroupNoteBlock: (blockId: string) => void,

    /**
     * This is the function that sets the active block for focus purposes
     */
    setActiveBlockState: (blockId: string) => void,

    /**
     * this is the function to move the focus up one display block
     */
    incrementFocusUp: () => void,

    /**
     * this is the function to move the focus down one display block
     */
    decrementFocusDown: () => void,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void,
    
    /*
     * This is the function to get the block styles 
     */
    getBlockStyles: (blockId: string) => IBlockStyles | undefined,
}

const NoteParagraph: React.FC<INoteParagraphProps> = ({ 
    block, 
    hasRequest, 
    endblock, 
    isTitleBlock,
    updateNoteBlock, 
    consumeFocusRequest, 
    changeNoteBlock,
    createFocusRequest,
    groupNoteBlock,
    appendNoteBlock,
    ungroupNoteBlock,
    setActiveBlockState,
    incrementFocusUp,
    decrementFocusDown,
    deleteNoteBlock,
    getBlockStyles
}) => {
    //this is the ref for the paragraph component
    const editableRef = useRef<HTMLParagraphElement>(null)

    //this is the toggle to focus the ref that the hook subscribes to
    const [focus, setFocus] = useState<boolean>(false)

    //whether or not this block is a title block
    const [title, setTitle] = useState<boolean>(false)

    //load in the hook that handles all text functionality
    const {
        flush,
        active,
        flavor,
        setBuffer,
        setActive,
        setFlush
    } = useTextBlock(block, hasRequest, endblock, focus, editableRef, updateNoteBlock, consumeFocusRequest)

    //this is the hook that handles the textcapture logic
    const { menuActive, position, getQueryText } = useTextCaptureHook(
        editableRef, 
        active, 
        block.blockId, 
        block.blockType, 
        active, 
        changeNoteBlock
    )

    //handles all text gestures for the block
    useTextGestures(
        active, 
        block.blockId, 
        menuActive, 
        editableRef, 
        groupNoteBlock, 
        appendNoteBlock, 
        ungroupNoteBlock, 
        incrementFocusUp,
        decrementFocusDown,
        deleteNoteBlock
    )

    //this is the click outside ref
    const ref = useClickOutside(() => {
        let element = editableRef.current
        if(element === null || menuActive === true)
            return

        element.blur()
    })

    const skip = useRef<boolean>(false)
    //this is the hook that handles the grip logic
    const { gripHandler } = useGrip(setActive)

    //this is the hook that handles the styling
    const { computed } = useBlockStyles(block, getBlockStyles)

    //effect that handles the setting of the title state
    useEffect(() => {
        if(isTitleBlock === undefined)
            return

        setTitle(isTitleBlock)
    }, [isTitleBlock])

    //effect that sets the active block if the current block is active
    useEffect(() => {
        if(active === false)
            return

        setActiveBlockState(block.blockId)
    }, [block, active])


    return (
        <div 
            ref={ref}
            className={styles.block__container}
        >
            <ActionMenu
                menuActive={menuActive}
                position={position}
                blockId={block.blockId}
                getQueryText={getQueryText}
                changeNoteBlock={changeNoteBlock}
                createFocusRequest={createFocusRequest}
            />

            <ActionIcon
                variant={"subtle"}
                size={"sm"}
                color={"gray"}
                ml={title ? -46 : -26}
                data-testId={"drag-handle"}
                onMouseDown={(e) => {
                    e.nativeEvent.stopImmediatePropagation()
                    skip.current = true
                    gripHandler()
                }}
                onMouseUp={() => setFocus(!focus)}
                style={{ 
                    opacity: active ? 1 : 0,
                    transition: "opacity 50ms linear" ,
                    pointerEvents: active ? "all" : "none"
                }}
            >
                <IconGripVertical style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
            
            <div 
                data-testId={"block-content"}
                style={{ width: "100%", marginLeft: title ? 20 : 0 }}
            >
                <p
                    ref={editableRef}
                    contentEditable={true}
                    className={styles.block__paragraph}
                    style={{ color: flavor ? "#5C5F66" : "#C1C2C5", ...computed }}
                    onInput={e => setBuffer(e.currentTarget.textContent?.trim())}
                    onFocus={() => setActive(true)}
                    onBlur={() => {
                        if(skip.current === true) {
                            skip.current = false
                            return
                        }

                        setFlush(!flush)
                        setActive(false)
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
