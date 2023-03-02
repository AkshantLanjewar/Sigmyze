import { IconBrackets, IconCpu, IconDatabase, IconFileCode2, IconGitCompare, IconTextRecognition } from "@tabler/icons";
import { IQuantaTypeGroup } from "../types/types";

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
            },
            {
                typeId: "array",
                typeName: "Indicators",
                typeIcon: <IconBrackets />,
                typeDescription: "list of elements"
            },
            {
                typeId: "sdmx_indicator",
                typeName: "SDMX Indicators",
                typeIcon: <IconDatabase />,
                typeDescription: "SDMX Indicator from parsed files"
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
    },
    {
        groupName: "SDMX Versions",
        groupId: "sdmx_version",
        types: [
            {
                typeId: "sdmx_2_1",
                typeName: "SDMX 2.1",
                typeIcon: <IconGitCompare />,
                typeDescription: "SDMX Version 2.1"
            }
        ]
    },
    {
        groupName: "SDMX File Types",
        groupId: "sdmx_file",
        types: [
            {
                typeId: "sdmx_xml",
                typeName: "SDMX XML",
                typeIcon: <IconFileCode2 />,
                typeDescription: "SDMX Xml file format"
            }
        ]
    }
] as IQuantaTypeGroup[]

export default typeGroups