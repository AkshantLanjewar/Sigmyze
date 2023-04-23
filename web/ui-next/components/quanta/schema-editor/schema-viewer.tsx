import { Badge, Box, Button, CloseButton, Collapse, Group, Stack, UnstyledButton } from "@mantine/core"
import { useState, MouseEvent, useEffect, useContext } from "react"
import { IQuantaSchema, IQuantaSchemaType } from "./types"
import styles from './schema-viewer.module.scss'
import { IconChevronDown, IconPlus } from "@tabler/icons"
import EditableText from "../../ui/editable-text/editable-text"
import SchemaTypeSelector from "./schema-type-selector"
import { QuantaContextData } from "../../data/quanta/context"
import { v4 } from "uuid"
import { IQuantaTypeRef } from "../quanta-editor/types/node-type"
import SchemaLinker from "./schema-linker"

interface ISchemaViewerProps {
    parentId: string,
    schemaNode: IQuantaSchema,
    additionalPadding?: number,
    light?: boolean,
    view: boolean
}

const color_table = {
    "schema": "red"
}

const SchemaViewer: React.FC<ISchemaViewerProps> = 
    ({ parentId, schemaNode, additionalPadding, light, view }) => {
    const [opened, setOpened] = useState(schemaNode.hasChildren ? true : false)
    const [editing, setEditing] = useState(false)
    const [internalType, setInternalType] = useState<IQuantaTypeRef | undefined>(undefined)

    const quantaContext = useContext(QuantaContextData)

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

    function setNodeName(text: string) {
        if(quantaContext === null)
            return
        if(schemaNode.nodeId === undefined)
            return

        quantaContext.editSchema(parentId, schemaNode.nodeId, "edit_text", text, undefined)
    }

    function emitEditBlur() {
        if(quantaContext === null)
            return

        quantaContext.unfocusAll(parentId)
    }

    function newNode() {
        let nNodeId = v4()
        if(quantaContext === null)
            return

        quantaContext.createElement(parentId, nNodeId)
    }

    function deleteNode() {
        let nodeId = schemaNode.nodeId
        if(nodeId === undefined || quantaContext === null)
            return

        quantaContext.deleteElement(parentId, nodeId)
    }
    
    useEffect(() => {
        let schemaType = schemaNode.quantaType
        if(schemaType === undefined)
            return

        setInternalType({ ...schemaType })
    }, [schemaNode, quantaContext?.updateSchema, quantaContext?.updateEditorSchema])

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
                        emitBlur={() => emitEditBlur()}
                        setValue={(val) => setNodeName(val)}
                        emitEditState={setEditing}
                    />
                </div>

                <Group spacing={8} className={styles.flare}>
                    {schemaNode.linkable && (
                        <SchemaLinker 
                            schemaId={schemaNode.linkId} 
                            schemaItemId={schemaNode.nodeId}
                        />
                    )}

                    {editing === false && (
                        <>
                            {schemaNode.mutableType
                                ? (
                                    <SchemaTypeSelector 
                                        type={internalType}
                                        parentNode={parentId}
                                        nodeId={schemaNode.nodeId}
                                    />
                                )
                                : (
                                    <Badge 
                                        variant="filled" 
                                        color={color_table[schemaNode.type as keyof typeof color_table]}
                                        size={"lg"}
                                    >
                                        {schemaNode.quantaType?.typeId}
                                    </Badge>
                                )
                            }

                            {schemaNode.removeableType === true && (
                                <CloseButton
                                    title="Remove Field"
                                    size={'md'}
                                    onClick={() => deleteNode()}
                                />
                            )}
                        </>
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
                                    parentId={parentId}
                                    schemaNode={step}
                                    additionalPadding={additionalPadding ? additionalPadding + 30 : 30}
                                    view={view}
                                />
                            ))}
                        </Stack>

                        {schemaNode.hasChildren && view === false && (
                            <Button
                                variant={'subtle'}
                                color={'gray'}
                                onClick={() => newNode()}
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