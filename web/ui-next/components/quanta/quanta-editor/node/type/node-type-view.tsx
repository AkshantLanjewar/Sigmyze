import { memo } from "react";
import { IQuantaType } from "../../types/node-type";
import { Badge, Group } from "@mantine/core";
import React from "react";

interface IViewProps {
    detailedType: IQuantaType | undefined
}

const NodeTypeView: React.FC<IViewProps> = memo(({ detailedType }) => {
    return (
        <Group align={"center"} position={"center"}>
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
                    
                    {detailedType?.typeName}
                </Group>
            </Badge>
        </Group>
    )
})

export default NodeTypeView