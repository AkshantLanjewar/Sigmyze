import { memo } from "react"
import { IPortalButton, IPortalButtonMenu } from "../../../lunar-refresh/types"
import { Menu, Stack, ThemeIcon, UnstyledButton } from "@mantine/core"
import React from "react"

import styles from '../sidebar.module.scss'

/**
 * theese are all the props needed for the portal menu button to function
 */
interface IPortalMenuButtonProps {
    /**
     * this is the actual definition for the portal button
     */
    button: IPortalButton,

    /**
     * this is the definition for the portal menu passed to us since we dont want to null check it
     */
    portalMenu: IPortalButtonMenu,

    /**
     * this is the index for the portal button 
     * NOTE: only used for debugging
     */
    index: number
}

const PortalMenuButton: React.FC<IPortalMenuButtonProps> = memo(({ button, portalMenu, index }) => (
    <Menu 
        position={'right-start'}
        withArrow
        arrowPosition={"center"}
    >
        <Menu.Target>
            <UnstyledButton
                className={`${styles.buttonElement} ${styles[button.buttonColor]}`}
                key={`sidebar-portal-${button.buttonId}`}
                onClick={() => button.onClick()}
                data-testId={`button-${index}`}
            >
                <div data-testId={button.buttonId}>
                    {React.cloneElement(button.buttonIcon, { "data-testId": button.buttonId })}
                </div>
            </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
            <Stack 
                spacing={'sm'}
                data-testId={portalMenu.testId}
            >                
                {portalMenu.menuButtons.map((step) => (
                    <UnstyledButton
                        data-testid={step.testId}
                        className={styles.portalMenuElement}
                        onClick={() => step.onClick()}
                    >
                        <ThemeIcon
                            color={"indigo"}
                            variant={"filled"}
                            size={'xl'}
                        >
                            {step.buttonIcon}
                        </ThemeIcon>

                        <div>
                            <div className={styles.title}>{step.buttonName}</div>
                            <div className={styles.desc}>
                                {step.buttonDescription}
                            </div>
                        </div>
                    </UnstyledButton>
                ))}
            </Stack>
        </Menu.Dropdown>
    </Menu>
))

export default PortalMenuButton