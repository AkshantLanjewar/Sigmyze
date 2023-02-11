import { v4 } from "uuid"
import { IDocumentBlock, IDocumentMenuItem } from "../../../../data/lunar/types/document-types"
import { FaParagraph} from 'react-icons/fa'
import { IconH1, IconH2, IconH3, IconH4, IconH5, IconH6 } from "@tabler/icons"

function RegisterTextBlocks() {
    let textBlocks = [] as IDocumentMenuItem[]
    
    //paragraphblock
    textBlocks.push({
        id: v4(),
        type: "paragraph",
        searchId: "paragraph",
        icon: <FaParagraph />,
        name: "Paragraph",
        config: {
            type: "paragraph"
        } as IDocumentBlock
    })

    //heading one
    textBlocks.push({
        id: v4(),
        type: "title",
        searchId: "heading_one",
        name: "Heading 1",
        icon: <IconH1 />,
        config: {
            type: "title",
            order: 1
        } as IDocumentBlock
    })

    //heading two
    textBlocks.push({
        id: v4(),
        type: "title",
        searchId: "heading_two",
        name: "Heading 2",
        icon: <IconH2 />,
        config: {
            type: "title",
            order: 2
        } as IDocumentBlock
    })

    textBlocks.push({
        id: v4(),
        type: "title",
        searchId: "heading_three",
        name: "Heading 3",
        icon: <IconH3 />,
        config: {
            type: "title",
            order: 3
        } as IDocumentBlock
    })

    textBlocks.push({
        id: v4(),
        type: "title",
        searchId: "heading_four",
        name: "Heading 4",
        icon: <IconH4 />,
        config: {
            type: "title",
            order: 4
        } as IDocumentBlock
    })

    textBlocks.push({
        id: v4(),
        type: "title",
        searchId: "heading_five",
        name: "Heading 5",
        icon: <IconH5 />,
        config: {
            type: "title",
            order: 5
        } as IDocumentBlock
    })

    textBlocks.push({
        id: v4(),
        type: "title",
        searchId: "heading_six",
        name: "Heading 6",
        icon: <IconH5 />,
        config: {
            type: "title",
            order: 6
        } as IDocumentBlock
    })

    return textBlocks
}

export default RegisterTextBlocks