import { useEffect, useRef, useState } from 'react'
import { IQuantaXYPos } from '../../../../quanta/quanta-editor/types/nodes'
import styles from './index.module.scss'
import { Motion, presets, spring } from 'react-motion'
import { ScrollArea, ThemeIcon, Title } from '@mantine/core'
import { BLOCK_REGSITRY, RegistryIcon } from '../block-types'
import useActionMenuState from './state'

interface IActionMenuProps {
    /**
     * This is whether or not the menu should be active
     */
    menuActive: boolean,

    /**
     * this is the position of the action menu
     */
    position: IQuantaXYPos
}

const ActionMenu: React.FC<IActionMenuProps> = ({ menuActive, position }) => {
    //whether or not to display the action menu
    const [display, setDisplay] = useState<boolean>(false)
    
    //whether or not to animate the action menu into view
    const [animate, setAnimate] = useState<boolean>(false)
    //flag to disable display
    const disableDisplayF = useRef<boolean>(false)

    const { active, trackRef } = useActionMenuState(animate)

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
                                            {BLOCK_REGSITRY.map((step, index) => {
                                                const isActive = index === active
                                                const rootClass = `${styles.context__menu__itm} ${isActive === true && styles.active}`

                                                return (
                                                    <div
                                                        onMouseDown={e => e.preventDefault()}
                                                        data-testId={`context-menu-opt-${index}`}
                                                        data-testValue={step.blockType}
                                                        data-active={`${isActive ? 'true' : 'false'}`}
                                                        className={rootClass}
                                                        ref={ref => trackRef(index, ref)}
                                                        
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