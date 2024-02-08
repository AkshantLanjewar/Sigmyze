import { IActionMenuAction } from "./types"
import styles from './index.module.scss'
import { Motion, spring } from "react-motion"
import { ActionIcon, Tooltip } from "@mantine/core"

interface IActionMenuProps {
    /**
     * actions to be rendered
     */
    actions: IActionMenuAction[],

    /**
     * whether or not the action menu is focused
     */
    focused: boolean
}

const ActionMenu: React.FC<IActionMenuProps> = ({ actions, focused }) => {
    return (
        <div className={styles.action__menu__wrapper}>
            <div className={styles.action}>
                <Motion style={{ x: spring(focused ? -75 : 0), opacity: spring(focused ? 1 : 0) }}>
                    {({ x, opacity }) => (
                        <div 
                            className={styles.action_wrapper}
                            style={{ 
                                position: 'absolute', 
                                bottom: x,
                                right: actions.length * 5, 
                                opacity: opacity,
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                gap: 7.5 
                            }}
                        >
                            {actions.map((step) => (
                                <Tooltip
                                    withArrow
                                    color={"dark"}
                                    label={step.label}
                                    styles={{ tooltip: { backgroundColor: "#08090A" } }}
                                    openDelay={250}
                                    transition={"slide-down"}
                                    position={"bottom"}
                                >
                                    <ActionIcon
                                        color={step.color}
                                        variant={"filled"}
                                        radius={"sm"}
                                        onClick={() => step.action()}
                                        data-testId={step.testId}
                                    >
                                        {step.icon}
                                    </ActionIcon>
                                </Tooltip>
                            ))}
                        </div>
                    )}
                </Motion>
            </div>
        </div>
    )
}

export default ActionMenu