import { Badge, Group } from "@mantine/core"
import React from "react"
import { IQuantaTypeRef } from "../../types"
import { getDetailedType } from "../../utils"

interface INodeTypeProps {
    type?: IQuantaTypeRef
}

const NodeType: React.FC<INodeTypeProps> = ({ type }) => {
    if(type === undefined)
        return null
    let detailedType = getDetailedType(type)

    return (
        <Group align={"center"} position={"center"}>
            {type !== undefined && (
                <>
                    <Badge
                        variant={"filled"}
                        color={"indigo"}
                    >
                        <Group spacing={2}>
                            {detailedType && (
                                <>
                                    {React.cloneElement(detailedType.typeIcon!, { size: 14 })}
                                </>
                            )}
                            
                            {type.typeId}
                        </Group>
                    </Badge>
                </>
            )}
        </Group>
    )
}

export default NodeType