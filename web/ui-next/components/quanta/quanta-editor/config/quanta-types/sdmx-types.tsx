import { IconFileCode2, IconGitCompare } from "@tabler/icons";
import { IQuantaTypeGroup } from "../../types/node-type";

const SDMXVersionTypes = {
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
} as IQuantaTypeGroup

const SDMXFileTypes = {
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
} as IQuantaTypeGroup

export { 
    SDMXVersionTypes,
    SDMXFileTypes 
}