import { Badge, Button, Group, Menu, Text } from "@mantine/core"
import { IconLink } from "@tabler/icons"
import { useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { SelectorPaneContextData } from "../selector-pane/context"
import { ISelectorPaneState } from "../selector-pane/context/types"

interface ISchemaLinkerProps {
    schemaId?: string,
    schemaItemId?: string
}

interface ISchemaMenuItem {
    itemId: string,
    itemName: string,
    itemType: string
}

const SchemaLinker: React.FC<ISchemaLinkerProps> = ({ schemaId, schemaItemId }) => {
    const [menuItems, setMenuItems] = useState<ISchemaMenuItem[]>([])
    const [linkedSchema, setLinkedSchema] = useState<string | null>(null)

    const { getSchema } = useContext(QuantaContextData) as IQuantaState
    const { setSelectorLink, selectorCode } = useContext(SelectorPaneContextData) as ISelectorPaneState

    useEffect(() => {
        if(schemaId === undefined)
            return

        let schema = getSchema(schemaId)
        if(schema === undefined)
            return

        let schemaChildren = schema.children
        if(schemaChildren === undefined)
            return

        let nMenuItems = [] as ISchemaMenuItem[]
        for(let i = 0; i < schemaChildren.length; i++) {
            let child = schemaChildren[i]
            if(child.nodeId === undefined || child.name === undefined || child.quantaType === undefined)
                continue

            nMenuItems.push({
                itemId: child.nodeId,
                itemName: child.name,
                itemType: child.quantaType.typeId!
            })
        }

        setMenuItems([ ...nMenuItems ])
    }, [schemaId])

    useEffect(() => {
        setLinkedSchema(null)
        if(selectorCode === null || schemaId === undefined)
            return

        let selectorLinks = selectorCode.selectorLinks
        if(selectorLinks === undefined)
            return

        let selectorLinksKeys = Object.keys(selectorLinks)
        let datasetItemId = undefined
        for(let i = 0; i < selectorLinksKeys.length; i++) {
            let linkKey = selectorLinksKeys[i]
            let linkVal = selectorLinks[linkKey]

            if(linkVal === schemaItemId)
                datasetItemId = linkKey
        }

        let schema = getSchema(schemaId)
        if(schema === undefined || datasetItemId === undefined)
            return

        let schemaChildren = schema.children
        if(schemaChildren === undefined)
            return

        for(let i = 0; i < schemaChildren.length; i++) {
            let child = schemaChildren[i]
            if(child.nodeId === datasetItemId && child.name !== undefined)
                setLinkedSchema(child.name)
        }
    }, [selectorCode])

    const itemClick = (itemId: string) => {
        if(schemaItemId === undefined)
            return

        setSelectorLink(itemId, schemaItemId)
    }
    
    return (
        <Menu
            shadow="md"
            width={200}
            withArrow
            position={'bottom-end'}
        >
            <Menu.Target>
                {linkedSchema
                    ? (
                        <Button
                            style={{ height: 26 }}
                            size={'xs'}
                            radius={'xl'}
                            variant={'outline'}
                            color={"grape"}
                        >
                            {linkedSchema}
                        </Button>
                    )
                    : (
                        <Button
                            style={{ height: 26 }}
                            size={'xs'}
                            radius={'xl'}
                            variant={'outline'}
                            color={"green"}
                        >
                            <Group spacing={2.5}>
                                <IconLink size={16} stroke={2} />
                                <span>Link Field</span>
                            </Group>
                        </Button>
                    )
                }
            </Menu.Target>

            <Menu.Dropdown>
                {menuItems.map((step) => (
                    <Menu.Item
                        key={step.itemId}
                        onClick={() => itemClick(step.itemId)}
                        rightSection={(
                            <Text
                                size={"xs"}
                                transform="uppercase"
                                weight={700}
                                color="dimmed"
                            >
                                {step.itemType}
                            </Text>
                        )}
                    >
                        <Text
                            size={"sm"}
                            weight={700}
                        >
                            {step.itemName}
                        </Text>
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}

export default SchemaLinker