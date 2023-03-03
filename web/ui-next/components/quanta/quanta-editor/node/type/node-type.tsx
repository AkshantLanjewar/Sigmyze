import { Badge, Group } from "@mantine/core"
import React from "react"
import { IQuantaTypeRef } from "../../types/types"
import { getDetailedType } from "../../utils"

interface INodeTypeProps {
    type?: IQuantaTypeRef,
    isArray?: boolean,
    arrayType?: IQuantaTypeRef
}

const NodeType: React.FC<INodeTypeProps> = ({ type, isArray, arrayType }) => {
    if(type === undefined)
        return null
    
    let displayType = type
    let detailedType = getDetailedType(displayType)
    if(isArray === true && arrayType !== undefined)
        displayType.typeId = arrayType.typeId

    return (
        <Group align={"center"} position={"center"}>
            {type !== undefined && (
                <>
                    <Badge
                        variant={"filled"}
                        color={"indigo"}
                        size={"lg"}
                    >
                        <Group spacing={2} align={"center"}>
                            {detailedType && (
                                <>
                                    {React.cloneElement(detailedType.typeIcon!, { size: 18 })}
                                </>
                            )}
                            
                            {displayType.typeId}
                        </Group>
                    </Badge>
                </>
            )}
        </Group>
    )
}

export default NodeType