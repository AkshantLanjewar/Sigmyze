import { IconGavel, IconListCheck, IconChartAreaLine, IconCalendarEvent } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

const ApplyDataRule = {
    name: "Apply Data Rule",
    icon: <IconGavel />,
    description: "Applies a preset rule on a chart data object",

    inputs: [
        {
            socketId: "rule",
            socketName: "Rule",
            icon: <IconListCheck />,
            staticSocket: true,
            selectableType: true,
            type: {
                groupId: "chart_rules",
                typeId: "is_projection"
            }
        },
        {
            socketId: "chart_data",
            socketName: "Chart Data",
            icon: <IconChartAreaLine />,
            type: {
                groupId: "base",
                typeId: "chart_data"
            }
        },
        {
            dynamicSocket: true,
            groupTitle: "Is Projection",
            dynamicDepend: "input_val",
            inputId: "rule",
            dependentInputs: [
                {
                    inputValue: "is_projection",
                    sockets: [
                        {
                            socketId: "last_date",
                            socketName: "Last Date Collected",
                            icon: <IconCalendarEvent />,
                            type: {
                                groupId: "base",
                                typeId: "date"
                            }
                        }
                    ]
                }
            ]
        }
    ],

    outputs: [
        {
            socketId: "chart_data",
            socketName: "Chart Data",
            icon: <IconChartAreaLine />,
            type: {
                groupId: "base",
                typeId: "chart_data"
            }
        }
    ]
} as IQuantaNodeInstructions

export { ApplyDataRule }