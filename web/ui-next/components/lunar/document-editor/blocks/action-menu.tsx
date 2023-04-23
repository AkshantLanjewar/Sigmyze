import { UnstyledButton, Group, Tooltip } from '@mantine/core'
import { forwardRef } from 'react'
import { IActionMenuItem } from '../../../data/lunar/types/document-types'
import styles from './action-menu.module.scss'

interface IActionMenuProps {
    active: boolean,
    items: IActionMenuItem[]
}

const ActionMenu = forwardRef<HTMLDivElement, IActionMenuProps>(({ active, items }, ref) => {
    return (
        <div
            className={`${styles.actionMenu} ${active && styles.show}`}
            ref={active ? ref : null}
        >
            {items.map((step) => (
                <UnstyledButton 
                    className={styles.action}
                    onClick={step.cb}
                >
                    <Tooltip
                        label={step.label}
                        withArrow
                        position={'bottom'}
                        color={"black"}
                        offset={10}
                    >
                        <Group 
                            position="center" 
                            align={"center"}
                            sx={{ width: '100%', height: '100%' }}
                        >
                            {step.icon}
                        </Group>
                    </Tooltip>
                </UnstyledButton>
            ))}
        </div>
    )
})

export default ActionMenu