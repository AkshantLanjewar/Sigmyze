import React, { useEffect, useState } from "react"
import { Blocks, IBlockStyles, INoteBlock } from "../../types"
import { BLOCK_SWITCH } from ".."
import styles from '../block-types/index.module.scss'
import { ActionIcon, Collapse } from "@mantine/core"
import { IconChevronDown } from "@tabler/icons"
import { Motion, spring } from "react-motion"

interface IGroupBlockProps {
    /**
     * This is the block that is a group that will be rendered
     */
    block: INoteBlock,

    /**
     * the order level of the group, 0 being the root layer
     */
    order: number,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the index of the block
     */
    index: number,

    /**
     * this is the length of the block list
     */
    blocksLength: number,

    /** 
     * Whether or not the blocks have been updated
    */
    blocksUpdated: boolean,

    /**
     * The active block within the editor
     */
    activeBlock: string | undefined,

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
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void,

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

    /*
     * This is the function to get the block styles 
     */
    getBlockStyles: (blockId: string) => IBlockStyles | undefined
}

const GroupBlock: React.FC<IGroupBlockProps> = ({ 
    block, 
    order,
    hasRequest, 
    index, 
    blocksLength, 
    blocksUpdated,
    activeBlock,
    updateNoteBlock, 
    consumeFocusRequest, 
    changeNoteBlock, 
    createRawBlock, 
    deleteNoteBlock, 
    createFocusRequest,
    groupNoteBlock,
    appendNoteBlock,
    ungroupNoteBlock,
    setActiveBlockState,
    incrementFocusUp,
    decrementFocusDown,
    getBlockStyles
}) => {
    //this is the title block to be rendered
    const [titleBlock, setTitleBlock] = useState<INoteBlock | undefined>(undefined)

    //whether or not to render the title block


    //these are the children that need to be rendered
    const [children, setChildren] = useState<INoteBlock[]>([])

    //whether or not the group is open
    const [open, setOpen] = useState<boolean>(true)

    const onMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.nativeEvent.stopImmediatePropagation()
        e.preventDefault()

        setOpen(!open)
    }

    //effect that handles the loading of the block data into the group
    useEffect(() => {
        let nTitleBlock: INoteBlock = JSON.parse(JSON.stringify(block))
        if(block.isGroup !== true || block.blockChildren === undefined)
            return

        setChildren([ ...block.blockChildren ])

        nTitleBlock.isGroup = false
        nTitleBlock.blockChildren = undefined
        setTitleBlock({ ...nTitleBlock })
    }, [block, blocksUpdated])

    return (
        <div className={styles.block__container}>
            <div className={styles.group}>
                <div 
                    data-testId={'nested-title-block'}
                    className={styles.group__title}
                >
                    <ActionIcon
                        size={"sm"}
                        variant={"transparent"}
                        color={"indigo"}
                        data-testId={"group-dropdown-handler"}
                        onMouseDown={e => onMouseDown(e)}
                    >
                        <Motion style={{ rotate: spring(open ? 0 : -90) }}>
                            {({ rotate }) => (
                                <IconChevronDown 
                                    style={{ 
                                        width: "70%", 
                                        height: "70%", 
                                        transform: `rotate(${rotate}deg)`
                                    }} 
                                    stroke={1.5} 
                                />
                            )}
                        </Motion>
                    </ActionIcon>

                    <div style={{ flexGrow: 1 }}>
                        {titleBlock
                            ? BLOCK_SWITCH(
                                titleBlock, 
                                hasRequest, 
                                index, 
                                children.length, 
                                blocksUpdated,
                                activeBlock,
                                updateNoteBlock, 
                                consumeFocusRequest,
                                changeNoteBlock,
                                createRawBlock,
                                deleteNoteBlock,
                                createFocusRequest,
                                groupNoteBlock,
                                appendNoteBlock,
                                ungroupNoteBlock,
                                setActiveBlockState,
                                incrementFocusUp,
                                decrementFocusDown,
                                getBlockStyles,
                                order + 1,
                                true 
                            )
                            : null
                        }
                    </div>
                </div>

                <Collapse 
                    in={open}
                    style={{ 
                        marginLeft: 11, 
                        marginTop: 5, 
                        borderLeft: "1.5px solid rgb(37 38 43)",
                        paddingLeft: 25,
                        paddingBottom: 5
                    }}
                >
                    <div data-testId={'nested-children'}>
                        {children.map((step, index) => (
                            <div
                                data-testId={`document-block-${index}::child::${order}`}
                                data-testValue={step.blockType}
                                data-active={step.blockId === activeBlock}
                            >
                                {BLOCK_SWITCH(
                                    step, 
                                    hasRequest, 
                                    index, 
                                    children.length, 
                                    blocksUpdated,
                                    activeBlock,
                                    updateNoteBlock, 
                                    consumeFocusRequest,
                                    changeNoteBlock,
                                    createRawBlock,
                                    deleteNoteBlock,
                                    createFocusRequest,
                                    groupNoteBlock,
                                    appendNoteBlock,
                                    ungroupNoteBlock,
                                    setActiveBlockState,
                                    incrementFocusUp,
                                    decrementFocusDown,
                                    getBlockStyles,
                                    order + 1
                                )}
                            </div>
                        ))}
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default GroupBlock
