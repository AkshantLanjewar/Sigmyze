import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Blocks, INoteBlock } from "../../../types";
import { useClickOutside } from "@mantine/hooks";
import useTextCaptureHook from "../hooks/text-capture-hook";
import useTextBlock from "../hooks/text-block";
import styles from '../index.module.scss'
import { ActionIcon } from "@mantine/core";
import useGrip from "../hooks/grip";
import { IconGripVertical } from "@tabler/icons";
import React from "react";
import getCaretPosition from '../hooks/util'
import useHeader from "../hooks/header";
import ActionMenu from "../../action-menu";
import useTextGestures from "../hooks/text-gesture";

const removeTicks = (val: string) => {
    const split = val.split(" ")
    if(split.length < 2)
        return ""

    let ret = ""
    for(let i = 1; i < split.length; i++)
        ret += split[i]

    return ret
}

interface INoteHeadingProps {
    /**
     * This is the block that is being rendered
     */
    block: INoteBlock,

    /**
     * The order of the heading
     */
    order: number,

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
}

const NoteHeading: React.FC<INoteHeadingProps> = ({
    block,
    order,
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
    deleteNoteBlock
}) => {
    //this is the toggle to focus the ref that the hook subscribes to
    const [focus, setFocus] = useState<boolean>(false)

    const [activeG, setActive] = useState<boolean>(false)

    //whether or not this block is the title block in a group
    const [groupTitle, setGroupTitle] = useState<boolean>(false)

    const skip = useRef<boolean>(false)
    //this is the hook that handles the grip logic
    const { gripHandler } = useGrip(setActive)

    //hook that holds all the header logic
    const {
        title,
        ticks,
        focused,
        tickRef,
        titleRef,
        titleEdit,
        cOrder,
        menuActive,
        position,
        active,
        getQueryText,
        focusHandler,
        blurHandler,
        setTicksActive
    } = useHeader(block, hasRequest, consumeFocusRequest, changeNoteBlock, updateNoteBlock)

    //this is the hook that handles the text gestures for the tick ref
    useTextGestures(
        active === "tick", 
        block.blockId, 
        menuActive, 
        tickRef, 
        groupNoteBlock, 
        appendNoteBlock, 
        ungroupNoteBlock, 
        incrementFocusUp,
        decrementFocusDown,
        deleteNoteBlock
    )
    //this is the same hook, only for the title ref now
    useTextGestures(
        active === "title", 
        block.blockId, 
        menuActive, 
        titleRef, 
        groupNoteBlock, 
        appendNoteBlock, 
        ungroupNoteBlock, 
        incrementFocusUp,
        decrementFocusDown,
        deleteNoteBlock
    )

    //effect that handles the setting of the groupTitle state
    useEffect(() => {
        console.log(isTitleBlock)
        if(isTitleBlock === undefined)
            return

        setGroupTitle(isTitleBlock)
    }, [isTitleBlock])

    //effect that sets the document's active block when the heading is focused
    useEffect(() => {
        if(focused === false)
            return

        setActiveBlockState(block.blockId)
    }, [focused, block])
    
    //this is the click outside ref
    const ref = useClickOutside(() => { 
        blurHandler() 

        const selection = window.getSelection();
        selection?.removeAllRanges()
    })

    //now we need to determine the element styling we are going to use
    let style = styles.heading__1
    switch(cOrder) {
        case 1:
            style = styles.heading__1
            break
        case 2:
            style = styles.heading__2
            break
        case 3:
            style = styles.heading__3
            break
        case 4:
            style = styles.heading__4
            break
        case 5:
            style = styles.heading__5
            break
        case 6:
            style = styles.heading__6
            break
        default:
            style = styles.heading__1
            break
    }

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
                ml={groupTitle ? -48 : -26}
                data-testId={"drag-handle"}
                onMouseDown={(e) => {
                    e.nativeEvent.stopImmediatePropagation()
                }}
                onMouseUp={() => setFocus(!focus)}
                style={{ 
                    opacity: focused ? 1 : 0,
                    transition: "opacity 50ms linear",
                    pointerEvents: focused ? "all" : "none"
                }}
            >
                <IconGripVertical style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>

            <div 
                data-testId={"block-content"}
                style={{ width: "100%", marginLeft: groupTitle ? 20 : 0 }}
            >
                <div 
                    data-testId={"block-content"}
                    style={{ width: "100%" }}
                    className={styles.heading__wrapper}
                >
                    <div
                        contentEditable={true}
                        className={style}
                        style={{ color: "#5C5F66", flexGrow: 0, display: focused ? "block" : "none" }}
                        ref={tickRef} 
                        onFocus={setTicksActive}
                    >
                        {ticks}
                    </div>
                    
                    <div
                        contentEditable={titleEdit}
                        className={style}
                        style={{ color: "#C1C2C5", cursor: "text" }}
                        onFocus={focusHandler}
                        ref={titleRef}
                    >
                        {title
                            ? title
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteHeading