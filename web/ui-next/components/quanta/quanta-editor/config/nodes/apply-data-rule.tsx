import { IconGavel, IconListCheck, IconChartAreaLine, IconCalendarEvent } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

/**
 * this is the test to make sure the apply data rule node works within the rest of the codebase
 * 
 * Mount Test Requirements:
 *  - title = Apply Data Rule
 *  - there are 3 input blocks
 *      - input 0 = Rule
 *      - input 1 = Chart Data
 *      - input 2 = dynamic input -> title = Data Rule
 *          - it has 1 group child
 *          -  child 0 = Last Date Collected
 *  - there is one output block
 *      - output 0 = Chart Data
 */

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
            groupTitle: "Data Rule",
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
                                groupId: "schema",
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
                groupId: "quanta",
                typeId: "chart_data"
            }
        }
    ]
} as IQuantaNodeInstructions

export { ApplyDataRule }