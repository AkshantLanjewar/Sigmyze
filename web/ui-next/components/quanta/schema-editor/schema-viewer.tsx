import { Badge, Collapse, UnstyledButton } from "@mantine/core"
import { useState } from "react"
import { IQuantaSchema, IQuantaSchemaType } from "./types"
import styles from './schema-viewer.module.scss'
import { IconChevronDown } from "@tabler/icons"

interface ISchemaViewerProps {
    schemaNode: IQuantaSchema,
    additionalPadding?: number
}

const color_table = {
    "schema": "red"
}

const SchemaViewer: React.FC<ISchemaViewerProps> = ({ schemaNode, additionalPadding }) => {
    const [opened, setOpened] = useState(false)
    
    return (
        <div>
            <UnstyledButton 
                className={`${styles.schema__node} ${schemaNode.type === "schema" && styles.dark}`}
                onClick={() => setOpened(!opened)}
            >
                <div className={styles.name}>
                    <IconChevronDown 
                        size={14} 
                        stroke={"2"} 
                        className={`${styles.chevron} ${opened && styles.active}`}
                    />

                    <div className={styles.text}>{schemaNode.name}</div> 
                </div>

                <div className={styles.flare}>
                    {schemaNode.mutableType
                        ? null
                        : <Badge variant="filled" color={color_table[schemaNode.type as keyof typeof color_table]}>{schemaNode.type}</Badge>
                    }
                </div>
            </UnstyledButton>

            <Collapse in={opened}>

            </Collapse>
        </div>
    )
}

export default SchemaViewer