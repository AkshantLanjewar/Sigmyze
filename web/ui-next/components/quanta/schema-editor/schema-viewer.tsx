import { Badge, Box, Collapse, UnstyledButton } from "@mantine/core"
import { useState, MouseEvent } from "react"
import { IQuantaSchema, IQuantaSchemaType } from "./types"
import styles from './schema-viewer.module.scss'
import { IconChevronDown } from "@tabler/icons"
import EditableText from "../../ui/editable-text/editable-text"

interface ISchemaViewerProps {
    schemaNode: IQuantaSchema,
    additionalPadding?: number
}

const color_table = {
    "schema": "red"
}

const SchemaViewer: React.FC<ISchemaViewerProps> = ({ schemaNode, additionalPadding }) => {
    const [opened, setOpened] = useState(false)

    function handleSchemaClick(e: MouseEvent<HTMLButtonElement>) {
        let target = e.target as any
        if(target.getAttribute('aria-label') === "editable")
            return

        setOpened(!opened)
    }
    
    return (
        <div>
            <UnstyledButton 
                className={`${styles.schema__node} ${schemaNode.type === "schema" && styles.dark}`}
                onClick={(e) => handleSchemaClick(e)}
            >
                <div className={styles.name}>
                    <IconChevronDown 
                        size={14} 
                        stroke={"2"} 
                        className={`${styles.chevron} ${opened && styles.active}`}
                    />

                    <EditableText
                        className={styles.text}
                        value={schemaNode.name}
                    />
                </div>

                <div className={styles.flare}>
                    {schemaNode.mutableType
                        ? null
                        : <Badge variant="filled" color={color_table[schemaNode.type as keyof typeof color_table]}>{schemaNode.type}</Badge>
                    }
                </div>
            </UnstyledButton>

            <Collapse in={opened}>
                <Box 
                    pl={20 + (additionalPadding ? additionalPadding : 0)}
                    py={5}
                >
                    swag
                </Box>
            </Collapse>
        </div>
    )
}

export default SchemaViewer