import { useEffect, useRef, useState } from 'react'
import { IQuantaXYPos } from '../../../../quanta/quanta-editor/types/nodes'
import styles from './index.module.scss'
import { Motion, presets, spring } from 'react-motion'
import { ScrollArea, ThemeIcon, Title } from '@mantine/core'
import { BLOCK_REGSITRY, RegistryIcon } from '../block-types'
import useActionMenuState from './state'
import { Blocks } from '../../types'

interface IActionMenuProps {
    /**
     * This is whether or not the menu should be active
     */
    menuActive: boolean,

    /**
     * this is the position of the action menu
     */
    position: IQuantaXYPos,

    /**
     * This is the blockId for the block this menu is attached to
     */
    blockId: string

    /**
     * This is the function that gets the query text
     */
    getQueryText: () => string | null,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * This is the function that creates a focus request within the editor
     */
    createFocusRequest: (blockId: string) => void
}

const ActionMenu: React.FC<IActionMenuProps> = ({ menuActive, position, blockId, getQueryText, changeNoteBlock, createFocusRequest }) => {
    //whether or not to display the action menu
    const [display, setDisplay] = useState<boolean>(false)
    
    //whether or not to animate the action menu into view
    const [animate, setAnimate] = useState<boolean>(false)
    //flag to disable display
    const disableDisplayF = useRef<boolean>(false)

    /**
     * @description
     *  - this is the function that changes the block type using the action menu
     * @param newType 
     *  - the new type for the block
     */
    const changeBlockType = (newType: Blocks) => {
        switch(newType) {
            case "paragraph":
                changeNoteBlock(blockId, "paragraph", "")
                break
            case "heading::1":
                changeNoteBlock(blockId, "heading::1", "#")
                break
            case "heading::2":
                changeNoteBlock(blockId, "heading::2", "##")
                break
            case "heading::3":
                changeNoteBlock(blockId, "heading::3", "###")
                break
            case "heading::4":
                changeNoteBlock(blockId, "heading::4", "####")
                break
            case "heading::5":
                changeNoteBlock(blockId, "heading::5", "#####")
                break
            case "heading::6":
                changeNoteBlock(blockId, "heading::6", "######")
                break
            case "media::chart":
                changeNoteBlock(blockId, "media::chart", "")
                break
            case "media::image":
                changeNoteBlock(blockId, "media::image", "")
                break
            default:
                return
        }

        setTimeout(() => createFocusRequest(blockId), 200)
    }

    const { active, blocks, trackRef } = useActionMenuState(animate, position, getQueryText, changeBlockType)

    //effect that handles the animate / deanimate movement
    useEffect(() => {
        if(menuActive === false) {
            disableDisplayF.current = true
            setAnimate(false)
        } else {
            setDisplay(menuActive)
        }
    }, [menuActive])

    //effect that handles when display is true
    useEffect(() => {
        if(display === true)
            setAnimate(display)
    }, [display])

    //effect that handles when animate is set to false
    useEffect(() => {
        if(disableDisplayF.current === true && animate === false)
            setTimeout(() => setDisplay(false), 400)
    }, [animate])

    return (
        <Motion style={{ x: spring(position.x, presets.stiff) }}>
            {({ x }) => (
                <div 
                    className={styles.context__menu__wrapper}
                    style={{ 
                        display: display ? "block" : "none",
                        left: x,
                        top: position.y - 240,
                    }}
                >
                    <div className={styles.context__menu__pos}>
                        <Motion style={{ 
                            y: spring(animate ? 30 : 0, presets.wobbly), 
                            opa: spring(animate ? 1 : 0, presets.stiff) 
                        }}>
                            {({ y, opa }) => (
                                <div 
                                    className={styles.context__menu}
                                    data-testId={'document-context-menu'}
                                    style={{ 
                                        bottom: y, 
                                        opacity: opa
                                    }}
                                >
                                    <ScrollArea h={"14rem"}>
                                        <div data-testId={'context-menu-options'}>
                                            {blocks.map((step, index) => {
                                                const isActive = index === active
                                                const rootClass = `${styles.context__menu__itm} ${isActive === true && styles.active}`

                                                return (
                                                    <div
                                                        data-testId={`context-menu-opt-${index}`}
                                                        data-testValue={step.blockType}
                                                        data-active={`${isActive ? 'true' : 'false'}`}
                                                        className={rootClass}
                                                        ref={ref => trackRef(index, ref)}
                                                        onMouseDown={e => {
                                                            e.preventDefault()
                                                            changeBlockType(step.blockType)
                                                        }}
                                                        
                                                    >
                                                        <ThemeIcon size={"lg"}>
                                                            <RegistryIcon block={step.blockType} />
                                                        </ThemeIcon>
        
                                                        <div className={styles.itm__title}>
                                                            <Title order={6}>{step.name}</Title>
                                                            <p>{step.description}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </Motion>
                    </div>
                </div>
            )}
        </Motion>
    )
}

export default ActionMenu