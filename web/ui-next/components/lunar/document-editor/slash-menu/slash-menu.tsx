import { IDocumentMenuItem } from "../../../data/lunar/document-types"
import { ChartDims } from "../../chart-view/engine/types"
import { ScrollArea } from '@mantine/core'
import styles from './slash-menu.module.scss'
import { useClickOutside, useScrollIntoView } from "@mantine/hooks"
import { useState, useEffect } from "react"
import SlashMenuItem from "./menu-item"
import { changeBlockType } from "../document-editor"
import { Motion, spring } from "react-motion"

interface ISlashMenuProps {
    position: ChartDims,
    inputActive: boolean,
    inputValue: string,
    inputId: string | null,
    menuItems: IDocumentMenuItem[],
    closeMenu: Function,
    changeBlockType: changeBlockType,
    setLeafMenuItm: (item: IDocumentMenuItem) => void
}

const SlashMenu: React.FC<ISlashMenuProps> = 
({ position, inputActive, inputValue, inputId, menuItems, closeMenu, changeBlockType, setLeafMenuItm }) => {
    const ref = useClickOutside<HTMLDivElement>(() => closeMenu())
    const { 
        scrollIntoView, 
        targetRef, 
        scrollableRef 
    } = useScrollIntoView<HTMLButtonElement>()

    const [activeIndex, setActiveIndex] = useState(0)
    const [displayMenu, setDisplayMenu] = useState([] as IDocumentMenuItem[])

    useEffect(() => {
        setDisplayMenu([ ...menuItems ])
    }, [])

    useEffect(() => {
        if(inputActive === true)
            return

        setDisplayMenu([ ...menuItems ])
    }, [menuItems])

    //debug

    useEffect(() => {
        if(inputActive === false) {
            setActiveIndex(0)
            setDisplayMenu([ ...menuItems ])
        }
    }, [inputActive])

    useEffect(() => {
        document.addEventListener("keydown", keyDownHandler)

        return () => {
            document.removeEventListener("keydown", keyDownHandler)
        }
    }, [inputActive, displayMenu, activeIndex])

    useEffect(() => {
        if(inputActive === false)
            return

        inputValue = inputValue.trim()
        if(inputValue.length === 0) {
            setDisplayMenu([ ...menuItems ])
            return
        }

        let nMenuItems = []
        for(let i = 0; i < menuItems.length; i++) {
            let menuItem = menuItems[i]
            let name = menuItem.searchId.substring(0, inputValue.length).toLowerCase()

            if(name === inputValue.toLowerCase())
                nMenuItems.push(menuItem)
        }
        
        setDisplayMenu([ ...nMenuItems ])
    }, [inputValue])

    useEffect(() => {
        if(displayMenu.length - 1 < activeIndex)
            setActiveIndex(displayMenu.length - 1)
    }, [displayMenu])

    //event handlers 
    
    function keyDownHandler(e: globalThis.KeyboardEvent) {
        if(inputActive === false)
            return
        if(displayMenu.length === 0)
            return
        
        const key = e.key
        let nActiveIndex = activeIndex

        switch(key) {
            case "ArrowDown":
                e.preventDefault()
                if(activeIndex === displayMenu.length - 1)
                    nActiveIndex = 0
                else
                    nActiveIndex = nActiveIndex + 1
                break
            case "ArrowUp":
                e.preventDefault()
                if(activeIndex === 0)
                    nActiveIndex = displayMenu.length - 1
                else
                    nActiveIndex = nActiveIndex - 1
                break
            case "Enter":
                SetItemActive(nActiveIndex)
                break
            default:
                break
        }

        setActiveIndex(nActiveIndex)
    }

    function SetItemActive(index: number) {
        if(index >= displayMenu.length)
            return

        let item = displayMenu[index]
        if(inputId === 'leaf-block') {
            setLeafMenuItm(item)
        } else {
            changeBlockType(item)
        }

        closeMenu()
    }

    return (
        <div className={styles['slash-wrapper']}>
            <Motion
                style={{
                    left: spring(position.x),
                    top: spring(position.y + 30)
                }}
            >
                {style => (
                    <div
                        className={styles.slashMenu}
                        style={{ 
                            top: style.top, 
                            left: style.left,
                            opacity: inputActive ? 1 : 0,
                            pointerEvents: inputActive ? 'auto' : 'none'
                        }}
                        ref={inputActive ? ref : null}
                    >
                        <div className={styles.inner}>
                            <ScrollArea 
                                style={{ height: 250 }}
                                ref={scrollableRef}
                            >
                                <div className={styles.content}>
                                    {displayMenu.map((step, index) => (
                                        <SlashMenuItem
                                            menuItem={step}
                                            active={index === activeIndex}
                                            index={index}
                                            setItemActive={SetItemActive}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
        
                            <div className={styles.arrow}>
                            
                            </div>
                        </div>
                    </div>
                )}
            </Motion>
        </div>
    )
}

export default SlashMenu