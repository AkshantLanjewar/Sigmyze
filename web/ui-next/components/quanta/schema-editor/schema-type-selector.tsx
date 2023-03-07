import { Group } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../data/quanta/context"
import { IUIDropdownItem } from "../../ui/ui-dropdown/types"
import UIDropdown from "../../ui/ui-dropdown/ui-dropdown"
import { IQuantaTypeRef } from "../quanta-editor/types/node-type"
import { convertTypesToDropdown } from "../quanta-editor/utils"

interface ISchemaTypeSelectorProps {
    type?: IQuantaTypeRef,
    parentNode: string,
    nodeId?: string
}

const SchemaTypeSelector: React.FC<ISchemaTypeSelectorProps> = ({ type, parentNode, nodeId }) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [dropdownItems, setDropdownItems] = useState<IUIDropdownItem[] | undefined>(undefined)

    const quantaContext = useContext(QuantaContextData)

    useEffect(() => {
        let typeId = type?.typeId
        let groupId = type?.groupId
        if(typeId === undefined || groupId === undefined)
            return

        setSelectedId(typeId)
        if(dropdownItems === undefined) {
            let dropdownItems_ = convertTypesToDropdown(groupId)
            if(dropdownItems_ === undefined)
                return

            dropdownItems_.shift()
            setDropdownItems([ ...dropdownItems_ ])
        }
    }, [type])

    function emitChange(id: string) {
        if(type?.typeId === undefined)
            return
        if(nodeId === undefined)
            return
        if(quantaContext === null)
            return

        let nType = type
        nType.typeId = id
        quantaContext.editSchema(parentNode, nodeId, "edit_type", "", nType)
    }

    return (
        <Group position={"center"}>
            {selectedId !== undefined && (
                <UIDropdown
                    items={dropdownItems}
                    value={selectedId}
                    emitChange={(id) => emitChange(id)}
                />
            )}
        </Group>
    )
}

export default SchemaTypeSelector