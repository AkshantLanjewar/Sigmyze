import { Navbar, Tooltip, UnstyledButton } from '@mantine/core'
import { IconAtom2, IconDatabase, IconDeviceFloppy, IconGlobe, IconStack2 } from '@tabler/icons'
import Link from 'next/link'
import DriveCreateItem from './drive-create-item'
import styles from './sidebar.module.scss'
import { IPortalButton } from '../../lunar-refresh/types'
import React from 'react'

interface ISidebarProps {
    location: string,
    portalButtons?: IPortalButton[]
}

/**
 * @param location
 *  this is the current location of the page
 * @param portalButtons
 *  this is the passed list of portal buttons, if there are any
 * @description
 *  this is the sidebar that is shown in protected routes
 *  if this sidebar is shown on the lunar page incorporate
 *  the stack explorer as well.
 */
const Sidebar: React.FC<ISidebarProps> = ({ location, portalButtons }) => {
    return (
        <Navbar width={{ base: 80 }}>
            <div className={styles.sidebarWrapper}>
                {portalButtons
                    ? (
                        <div className={`${styles.elements} ${styles.border}`} data-testId={'button-portal'}>
                            {portalButtons.map((step, index) => {
                                if(step.buttonIcon === undefined)
                                    return

                                return (
                                    <UnstyledButton 
                                        className={`${styles.buttonElement} ${styles[step.buttonColor]}`}
                                        key={`sidebar-portal-${step.buttonId}`}
                                        onClick={() => step.onClick()}
                                        data-testId={`button-${index}`}
                                    >
                                        {React.cloneElement(step.buttonIcon, { "data-testId": step.buttonId })}
                                    </UnstyledButton>
                                )
                            })}
                        </div>
                    )
                    : null
                }

                <div className={`${styles.elements} ${location === '/lunar' && styles.border}`}>
                    {location === '/drive' && (
                        <>
                            <DriveCreateItem /> 
                        </>
                    )}

                    <Link href={"/drive"}>
                        <Tooltip
                            label={"Drive"}
                            position={"right"}
                            withArrow
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        >
                            <div className={`${styles.element} ${location === '/drive' && styles.active}`}>
                                <IconDeviceFloppy />
                            </div>
                        </Tooltip>
                    </Link>

                    <Link href={"/lunar"}>
                        <Tooltip
                            label={"Lunar Editor"}
                            position={"right"}
                            withArrow
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        >
                            <div className={`${styles.element} ${location === '/lunar' && styles.active}`}>
                                <IconGlobe />
                            </div>
                        </Tooltip>
                    </Link>

                    <Link href={"/quanta"}>
                        <Tooltip
                            label={"Quanta Editor"}
                            position={"right"}
                            withArrow
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        >
                            <div className={`${styles.element} ${location === '/quanta' && styles.active}`}>
                                <IconAtom2 />
                            </div>
                        </Tooltip>
                    </Link>

                    <Link href={"/datasets"}>
                        <Tooltip
                            label={"Datasets"}
                            position={"right"}
                            withArrow
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        >
                            <div className={`${styles.element}`}>
                                <IconDatabase />
                            </div>
                        </Tooltip>
                    </Link>
                </div>

                {location === '/lunar' && (
                    <div className={`${styles.elements} ${styles.stacks}`}>
                        <Tooltip
                            label={"Explorer"}
                            position={"right"}
                            withArrow
                            styles={{ tooltip: { backgroundColor: "#08090A" } }}
                        >
                            <div className={`${styles.element} ${styles.active}`}>
                                <IconStack2 />
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>
        </Navbar>
    )
}

export default Sidebar