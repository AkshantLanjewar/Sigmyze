import { IconTextRecognition, IconCpu, IconBrackets, IconDatabase, IconChartAreaLine, IconCalendarEvent, IconInputSearch, IconStack2 } from "@tabler/icons"
import { IQuantaTypeGroup } from "../../types/node-type";

const BaseTypes = {
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
            typeName: "SDMX Indicator",
            typeIcon: <IconDatabase />,
            typeDescription: "SDMX Indicator from parsed files"
        },
        {
            typeId: "sdmx_field",
            typeName: "SDMX Field",
            typeIcon: <IconStack2 />,
            typeDescription: "Field from SDMX Indicator"
        },
        {
            typeId: "chart_data",
            typeName: "Chart Data",
            typeIcon: <IconChartAreaLine />,
            typeDescription: "Chart Data used by all time series data"
        },
        {
            typeId: "date",
            typeName: "Date",
            typeIcon: <IconCalendarEvent />,
            typeDescription: "Date element"
        }
    ]
} as IQuantaTypeGroup

const ChartRules = {
    groupName: "Chart Rules",
    groupId: "chart_rules",
    types: [
        {
            typeId: "is_projection",
            typeName: "Is Projection",
            typeIcon: <IconCalendarEvent />,
            typeDescription: "Whether or not the data is a projection"
        }
    ]
} as IQuantaTypeGroup

export { BaseTypes, ChartRules }