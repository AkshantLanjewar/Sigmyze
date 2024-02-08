import { Button, Menu, ScrollArea, ThemeIcon, Title } from "@mantine/core"
import { IconCaretDown, IconChevronDown, IconHeading } from "@tabler/icons"
import React, { useState } from "react"
import { Motion, spring } from "react-motion"
import { RegistryIcon } from "../../block-renderer/block-types"
import { Blocks, INoteBlock } from "../../types"
import { useTextSelector } from "./state"

import styles from './index.module.scss'

interface ITextSelectorArrowProps {
    /**
    * whether or not the menu is currently opened
    */
    opened: boolean
}

const TextSelectorArrow: React.FC<ITextSelectorArrowProps> = ({ opened }) => {
    return (
        <>
            <Motion style={{ rotate: spring(opened ? 0 : -90) }}>
                {({ rotate }) => (
                    <IconChevronDown 
                        width={14} 
                        height={14} 
                        stroke={3.5}
                        style={{ transform: `rotate(${rotate}deg)` }}
                    />
                )}
            </Motion>
        </>
    )
}

interface ITextSelectorProps {
    /**
     * this is the active block within the editor
     */
    activeBlock: string | undefined
    
    /**
     * these are the rendered blocks within the editor
     */
    blocks: INoteBlock[]

    /*
     * this is the function that handles the changing of the requested note block
    */
    changeNoteBlock: (blockId: string, newTypes: Blocks, newContent: string) => void
}

const TextSelector: React.FC<ITextSelectorProps> = ({ activeBlock, blocks, changeNoteBlock }) => {
    const [opened, setOpened] = useState<boolean>(false)
    const { active, menuBlocks, loading, transformActiveBlock } = useTextSelector(activeBlock, blocks, changeNoteBlock)

    return (
        <div 
            data-testId={"heading-dropdown"}
            data-activeNode={active?.blockType}
        >
            <Menu
                shadow={"md"}
                width={220}
                withArrow
                transition={"slide-down"}
                transitionDuration={200}
                opened={opened}
                onOpen={() => setOpened(true)}
                onClose={() => setOpened(false)}
                position={"bottom"}
            >
                <Menu.Target>
                    <Button
                        size={"md"}
                        variant={"subtle"}
                        color={"dark"}
                        loading={loading}
                        styles={{
                            label: {
                                width: "auto",
                                display: "flex",
                                flexDirection: "row",
                                gap: 30,
                                alignItems: "center",
                                justifyContent: "space-between"
                            }
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 5,
                                alignItems: "center"
                            }}
                        >
                            <TextSelectorArrow opened={opened} />
                            <div style={{ height: 14 }}>
                                {active
                                    ? active.name
                                    : "Loading"
                                }
                            </div>
                        </div>

                        <ThemeIcon
                            color={"indigo"}
                            size={"md"} 
                        >
                            {active
                                ? <RegistryIcon block={active.blockType} />
                                : <IconHeading width={"70%"} height={"70%"} stroke={2.5} />
                            }
                        </ThemeIcon>
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <ScrollArea h={350}>
                        <div 
                            data-testId={"heading-items"}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                                maxWidth: 210
                            }}
                        >
                            {menuBlocks.map((step, index) => (
                                <div 
                                    data-testId={`heading-item-${index}`}
                                    data-testValue={step.blockType}
                                    className={`${styles.heading__item} ${active?.blockType === step.blockType ? styles.active : ""}`}
                                    onClick={() => {
                                        transformActiveBlock(step.blockType)
                                        setOpened(false)
                                    }}
                                >
                                    <ThemeIcon
                                        size={"xl"}
                                        color={"indigo"}
                                    >
                                        <RegistryIcon block={step.blockType} scale={true} />
                                    </ThemeIcon>
    
                                    <div className={styles.heading__title}>
                                        <Title order={4}>{step.name}</Title>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}

export default TextSelector
