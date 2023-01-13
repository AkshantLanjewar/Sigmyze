import { IDocumentBlock } from "../../../data/lunar/document-types"
import { Text, Group, ActionIcon } from '@mantine/core'
import { IconGripVertical } from "@tabler/icons"
import styles from './text-block.module.scss'
import { useHover } from "@mantine/hooks"
import { useState, FocusEvent, useRef, useEffect } from "react"
import { ParseContentInput } from "./utils"

interface IParagraphBlockProps {
    block: IDocumentBlock
}

const TextBlock: React.FC<IParagraphBlockProps> = ({ block }) => {
    const [active, setActive] = useState(false)
    const { hovered, ref } = useHover()
    const textRef = useRef<HTMLDivElement>(null)

    //event handlers

    function focus(e: FocusEvent<HTMLDivElement, Element>) {
        //clear the text
        if(textRef.current === null)
            return
        textRef.current.innerText = ""

        setActive(true)
    }

    function blur(e: FocusEvent<HTMLDivElement, Element>) {
        //set it back to leaf
        if(textRef.current === null)
            return

        let leaf = block.leaf
        let text = textRef.current.innerHTML
        if(leaf === true)
            textRef.current.innerText = "Type / for a list of commands"
        setActive(false)
        if(text.length === 0)
            return
        
        let parsedOutput = ParseContentInput(text)
        if(leaf === true) {
            
        }
    }

    let textStyles = {
        italic: "normal",
        color: "normal"
    }

    if(block.leaf === true) {
        if(active === false) {
            textStyles.italic = "italic" 
            textStyles.color = "dimmed"
        }
    }

    return (
        <div>
            <Group spacing={"xs"} align={"center"} ref={ref}>
                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: hovered || active ? 1 : 0 }}
                >
                    <IconGripVertical />
                </ActionIcon>

                <Text
                    contentEditable={true}
                    className={styles.paragraphBlock}
                    onFocus={e => focus(e)}
                    onBlur={e => blur(e)}
                    ref={textRef}
                    fs={textStyles.italic}
                    color={textStyles.color}
                >
                    {block.leaf === true && "Type / for a list of commands"}
                </Text>

                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: 0 }}
                />
            </Group>
        </div>
    )
}

export default TextBlock