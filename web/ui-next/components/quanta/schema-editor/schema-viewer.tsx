import { Badge, Box, Button, CloseButton, Collapse, Group, Stack, UnstyledButton } from "@mantine/core"
import { useState, MouseEvent } from "react"
import { IQuantaSchema, IQuantaSchemaType } from "./types"
import styles from './schema-viewer.module.scss'
import { IconChevronDown, IconPlus } from "@tabler/icons"
import EditableText from "../../ui/editable-text/editable-text"

interface ISchemaViewerProps {
    schemaNode: IQuantaSchema,
    additionalPadding?: number,
    parentId?: string,
    createItem: (nodeId: string) => void,
    deleteItem: (parentId: string, nodeId: string) => void,
    unfocusItems: () => void
}

const color_table = {
    "schema": "red"
}

const SchemaViewer: React.FC<ISchemaViewerProps> = 
    ({ schemaNode, additionalPadding, parentId, createItem, deleteItem, unfocusItems }) => {
    const [opened, setOpened] = useState(false)

    function handleSchemaClick(e: MouseEvent<HTMLButtonElement>) {
        if(schemaNode.hasChildren === false) {
            setOpened(false)
            return
        }

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
                    {schemaNode.hasChildren
                        ? (
                            <IconChevronDown 
                                size={14} 
                                stroke={"2"} 
                                className={`${styles.chevron} ${opened && styles.active}`}
                            />
                        )
                        : null
                    }

                    <EditableText
                        className={styles.text}
                        value={schemaNode.name}
                        defaultValue={schemaNode.focusNode}
                        emitBlur={unfocusItems}
                    />
                </div>

                <div className={styles.flare}>
                    <Group spacing={5}>
                        {schemaNode.mutableType
                            ? null
                            : <Badge variant="filled" color={color_table[schemaNode.type as keyof typeof color_table]}>{schemaNode.type}</Badge>
                        }

                        {schemaNode.removeableType === true && (
                            <CloseButton
                                title="Remove Field"
                                size={'md'}
                                onClick={() => {
                                    if(parentId === undefined)
                                        return
                                    if(schemaNode.nodeId === undefined)
                                        return

                                    deleteItem(parentId, schemaNode.nodeId)
                                }}
                            />
                        )}
                    </Group>
                </div>
            </UnstyledButton>

            <Collapse in={opened} >
                <Group position={'right'}>
                    <Box 
                        py={5}
                        sx={{ width: `calc(100% - ${30 + (additionalPadding ? additionalPadding : 0)}px)` }}
                    >
                        <Stack spacing={5} pb={5}>
                            {schemaNode.children?.map((step) => (
                                <SchemaViewer
                                    schemaNode={step}
                                    createItem={createItem}
                                    additionalPadding={additionalPadding ? additionalPadding + 30 : 30}
                                    unfocusItems={unfocusItems}
                                    parentId={schemaNode.nodeId}
                                    deleteItem={deleteItem}
                                />
                            ))}
                        </Stack>

                        {schemaNode.hasChildren && (
                            <Button
                                variant={'subtle'}
                                color={'gray'}
                                onClick={() => createItem(schemaNode.nodeId!)}
                            >
                                <Group spacing={5}>
                                    <IconPlus size={16} stroke={"2"} />

                                    Add Item
                                </Group>
                            </Button>
                        )}
                    </Box>
                </Group>
            </Collapse>
        </div>
    )
}

export default SchemaViewer