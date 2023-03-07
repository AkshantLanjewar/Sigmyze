import { IconDatabase } from "@tabler/icons";
import { IQuantaTypeGroup } from "../../types/node-type";

const QuantaTypes = {
    groupId: "quanta",
    groupName: "Quanta Types",

    types: [
        {
            typeId: "field",
            typeName: "Field",
            typeIcon: <IconDatabase />,
            typeDescription: "The data fields within an indicator"
        }
    ]
} as IQuantaTypeGroup

export { QuantaTypes }