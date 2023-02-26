import { Badge, Box, Button, CloseButton, Collapse, Group, Stack, UnstyledButton } from "@mantine/core"
import { useState, MouseEvent, useEffect } from "react"
import { IQuantaSchema, IQuantaSchemaType } from "./types"
import styles from './schema-viewer.module.scss'
import { IconChevronDown, IconPlus } from "@tabler/icons"
import EditableText from "../../ui/editable-text/editable-text"
import UIDropdown from "../../ui/ui-dropdown/ui-dropdown"
import { GetPrebuiltDropdown } from "../../ui/ui-dropdown/utils"
import { SchemaFunctions } from "./schema-editor"

interface ISchemaViewerProps {
    schemaNode: IQuantaSchema,
    additionalPadding?: number,
    parentId?: string,
    light?: boolean,
    createItem: (nodeId: string) => void,
    editText: (nodeId: string, text: string) => void,
    unfocusItems: () => void,
    editSchema?: (nodeId: string, type: SchemaFunctions, text: string) => void
}

const color_table = {
    "schema": "red"
}

const SchemaViewer: React.FC<ISchemaViewerProps> = 
    ({ schemaNode, additionalPadding, parentId, light, createItem, editText, unfocusItems, editSchema }) => {
    const [opened, setOpened] = useState(schemaNode.hasChildren ? true : false)

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
                className={`${styles.schema__node} ${light && styles.light}`}
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
                        setValue={(val) => editText(schemaNode.nodeId!, val)}
                    />
                </div>
                    <Group spacing={5} className={styles.flare}>
                        {schemaNode.mutableType
                            ? (
                                <UIDropdown
                                    size={"xs"}
                                    items={GetPrebuiltDropdown("schema")}
                                    value={schemaNode.type}
                                    emitChange={(menuId) => {
                                        if(editSchema === undefined)
                                            return
                                        if(schemaNode.nodeId === undefined)
                                            return

                                        console.log(menuId)
                                        editSchema(schemaNode.nodeId, "edit_type", menuId)
                                    }}
                                />
                            )
                            : (
                                <Badge 
                                    variant="filled" 
                                    color={color_table[schemaNode.type as keyof typeof color_table]}
                                >
                                    {schemaNode.type}
                                </Badge>
                            )
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
                                    if(editSchema === undefined)
                                        return

                                    editSchema(parentId, "delete", schemaNode.nodeId)
                                }}
                            />
                        )}
                    </Group>
            </UnstyledButton>

            <Collapse in={opened}>
                <Group position={'right'}>
                    <Box 
                        pt={5}
                        sx={{ width: `calc(100% - ${30 + (additionalPadding ? additionalPadding : 0)}px)` }}
                    >
                        <Stack spacing={5}>
                            {schemaNode.children?.map((step) => (
                                <SchemaViewer
                                    schemaNode={step}
                                    createItem={createItem}
                                    additionalPadding={additionalPadding ? additionalPadding + 30 : 30}
                                    unfocusItems={unfocusItems}
                                    parentId={schemaNode.nodeId}
                                    editText={editText}
                                    editSchema={editSchema}
                                />
                            ))}
                        </Stack>

                        {schemaNode.hasChildren && (
                            <Button
                                variant={'subtle'}
                                color={'gray'}
                                onClick={() => createItem(schemaNode.nodeId!)}
                                mt={5}
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