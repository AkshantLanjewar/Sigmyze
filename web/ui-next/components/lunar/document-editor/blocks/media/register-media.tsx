import { v4 } from "uuid"
import { IDocumentBlock, IDocumentMenuItem } from "../../../../data/lunar/types/document-types"

import { IconPhoto } from "@tabler/icons"

function RegisterMediaBlocks() {
    let mediaBlocks = [] as IDocumentMenuItem[]

    //image block
    mediaBlocks.push({
        id: v4(),
        type: "image",
        searchId: "image",
        icon: <IconPhoto />,
        name: "Image",
        config: {
            type: "image"
        } as IDocumentBlock
    })

    return mediaBlocks
}

export default RegisterMediaBlocks