import { Badge, Group } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { IQuantaType, IQuantaTypeRef } from "../../types/types"
import { getDetailedType } from "../../utils"
import NodeTypeView from "./node-type-view"

interface INodeTypeProps {
    type?: IQuantaTypeRef,
    isArray?: boolean,
    arrayType?: IQuantaTypeRef
}

const NodeType: React.FC<INodeTypeProps> = ({ type, isArray, arrayType }) => {
    const [internalType, setInternalType] = useState<IQuantaTypeRef | undefined>(undefined)
    const [internalDetailedType, setInternalDetailedType] = useState<IQuantaType | undefined>(undefined)
    
    useEffect(() => {
        if(type === undefined)
            return

        let detailedType = getDetailedType(type)
        let displayType = type
        if(isArray === true && arrayType !== undefined)
            displayType.typeId = arrayType.typeId

        setInternalType({ ...displayType })
        setInternalDetailedType({ ...detailedType })
    }, [type, isArray, arrayType])

    if(internalType === undefined || internalDetailedType === undefined)
        return null
    else
        return <NodeTypeView detailedType={internalDetailedType} />
}

export default NodeType