import { IconBracketsContain, IconCalendarEvent, IconChartAreaLine, IconTextRecognition } from "@tabler/icons";
import { IQuantaTypeGroup } from "../../types/node-type";

const SchemaTypes = {
    groupName: "Schema Types",
    groupId: "schema",
    types: [
        {
            typeId: "schema",
            typeName: "Schema",
            typeIcon: <IconBracketsContain />,
            typeDescription: "This is the object for the schema class"
        },
        {
            typeId: "string",
            typeName: "String",
            typeIcon: <IconTextRecognition />,
            typeDescription: "can hold text based values"
        },
        {
            typeId: "date",
            typeName: "Date",
            typeIcon: <IconCalendarEvent />,
            typeDescription: "Date element"
        }
    ]
} as IQuantaTypeGroup

export { SchemaTypes }