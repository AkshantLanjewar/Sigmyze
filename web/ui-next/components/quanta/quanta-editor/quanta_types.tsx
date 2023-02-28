import { IconCpu, IconFileCode2, IconTextRecognition } from "@tabler/icons";
import { IQuantaTypeGroup } from "./types";

const typeGroups = [
    {
        groupName: "Base Types",
        groupId: "base",
        types: [
            {
                typeId: "string",
                typeName: "String",
                typeIcon: <IconTextRecognition />,
                typeDescription: "can hold text based values"
            },
            {
                typeId: "thread",
                typeName: "Thread",
                typeIcon: <IconCpu />,
                typeDescription: "exeucution flow for the graph"
            }
        ]
    },
    {
        groupName: "File Types",
        groupId: "files",
        types: [
            {
                typeId: "xml",
                typeName: "XML File",
                typeIcon: <IconFileCode2 />,
                typeDescription: "XML File type"
            },
            {
                typeId: "xsd",
                typeName: "XSD File",
                typeIcon: <IconFileCode2 />,
                typeDescription: "XSD File type"
            }
        ]
    }
] as IQuantaTypeGroup[]

export default typeGroups