import { IconMapSearch, IconDatabaseImport, IconChartAreaLine } from "@tabler/icons"
import { IQuantaNodeInstructions } from "../../types/types"

const SDMXDataMapper = {
    name: "SDMX Data Mapper",
    icon: <IconMapSearch />,
    description: "This node exposes the fields within an SDMX indicator",
    cacheable: true,

    inputs: [
        {
            socketId: "sdmx_data",
            socketName: "SDMX Data",
            icon: <IconDatabaseImport />,
            type: {
                groupId: "base",
                typeId: "sdmx_indicator"
            }
        }
    ],

    outputs: [
        {
            dynamicSocket: true,
            dynamicDepend: "execution",
            groupTitle: "SDMX Fields",
            executionField: "sdmx_fields"
        },
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

export { SDMXDataMapper }