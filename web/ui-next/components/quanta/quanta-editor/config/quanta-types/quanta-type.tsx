import { IconChartAreaLine, IconDatabase } from "@tabler/icons";
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
        },
        {
            typeId: "chart_data",
            typeName: "Chart Data",
            typeIcon: <IconChartAreaLine />,
            typeDescription: "Chart Data used by all time series data"
        },
    ]
} as IQuantaTypeGroup

export { QuantaTypes }