import { memo } from "react"
import { IPortalButton } from "../../../lunar-refresh/types"
import { UnstyledButton } from "@mantine/core"

import styles from '../sidebar.module.scss'
import React from "react"
import PortalMenuButton from "./portal-menu-button"

/**
 * theese are the props required in order to render the portal buttons
 */
interface IPortalButtonsProps {
    /**
     * theese are the list of portal buttons that need to be rendered
     */
    portalButtons: IPortalButton[]
}

const PortalButtons: React.FC<IPortalButtonsProps> = memo(({ portalButtons }) => (
    <div className={`${styles.elements} ${styles.border}`} data-testId={'button-portal'}>
        {portalButtons.map((step, index) => {
            if(step.buttonIcon === undefined)
                return
            if(step.portalMenu !== undefined)
                return <PortalMenuButton button={step} index={index} portalMenu={step.portalMenu} />
            
            return (
                <UnstyledButton
                    className={`${styles.buttonElement} ${styles[step.buttonColor]}`}
                    key={`sidebar-portal-${step.buttonId}`}
                    onClick={() => step.onClick()}
                    data-testId={`button-${index}`}
                >
                    <div data-testId={step.buttonId} style={{ height: 24 }}>
                        {React.cloneElement(step.buttonIcon, { "data-testId": step.buttonId })}
                    </div>
                </UnstyledButton>
            )
        })}
    </div>
))

export default PortalButtons