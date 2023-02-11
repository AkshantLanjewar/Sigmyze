import { IconChartBar } from "@tabler/icons"
import { v4 } from "uuid"
import { IDocumentBlock, IDocumentMenuItem } from "../../../../data/lunar/types/document-types"

function RegisterData() {
    let dataBlocks = [] as IDocumentMenuItem[]

    //chart block
    dataBlocks.push({
        id: v4(),
        type: "chart",
        searchId: "chart",
        icon: <IconChartBar />,
        name: "Chart",
        config: {
            type: "chart"
        } as IDocumentBlock
    })

    return dataBlocks
}

export { RegisterData }