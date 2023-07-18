import { useCallback, useContext, useEffect, useState } from "react"
import { IUIDropdownItem } from "../../../../ui/ui-dropdown/types"
import { IQuantaEditorGlobals, IQuantaSocket, IQuantaTypeRef } from "../../types/types"
import { convertTypesToDropdown } from "../../utils"
import { QuantaEditorContext } from "../../quanta-editor"
import NodeTypeSelectorView from "./type-selector-view"

interface INodeTypeSelector {
    output?: IQuantaSocket,
    focused?: boolean,
    socketId?: string,
    editType?: (itemId: string, newType: IQuantaTypeRef) => void
}

const NodeTypeSelector: React.FC<INodeTypeSelector> = ({ output, focused, socketId, editType }) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [dropdownItems, setDropdownItems] = useState<IUIDropdownItem[] | undefined>(undefined)
    const [subscribeClose, setSubscribeClose] = useState(false)

    const { viewOnly } = useContext(QuantaEditorContext) as IQuantaEditorGlobals

    useEffect(() => {
        //typeid
        let typeId = output?.type?.typeId
        let groupId = output?.type?.groupId
        if(typeId === undefined)
            return

        setSelectedId(typeId)
        if(dropdownItems === undefined) {
            if(groupId === undefined)
                return

            let dropdownItems_ = convertTypesToDropdown(groupId)
            if(dropdownItems_ === undefined)
                return

            setDropdownItems([ ...dropdownItems_ ])
        }
    }, [output])

    useEffect(() => {
        if(focused === undefined)
            return

        if(focused === false)
            setSubscribeClose(!subscribeClose)
    }, [focused])

    /**
     * 
     * @param id 
     *  NOTE: NOt the socket id
     * @returns 
     */
    const emitChange = useCallback((id: string) => {
        if(output?.type === undefined)
            return
        if(socketId === undefined)
            return
        if(editType === undefined)
            return

        let nRef = output.type
        nRef.typeId = id
        editType(id, nRef)
    }, [output, socketId, editType])
    
    return (
        <NodeTypeSelectorView
            selectedId={selectedId}
            dropdownItems={dropdownItems}
            subscribeClose={subscribeClose}
            viewOnly={viewOnly}
            emitChange={emitChange}
        />
    )
}

export default NodeTypeSelector