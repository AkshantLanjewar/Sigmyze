import { IconFileCode2 } from "@tabler/icons";
import { IQuantaTypeGroup } from "../../types/types";

const FileTypes = {
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
} as IQuantaTypeGroup

export { FileTypes }