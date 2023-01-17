import { TitleOrder } from "@mantine/core/lib/Title"
import { ITextNode } from "../../lunar/document-editor/blocks/types"

interface IDocument {
    pages: IDocumentPage[],
    document_id: string
}

interface IDocumentPage {
    blocks: IDocumentBlock[]
}

type TextTypes = "title" | "paragraph"

interface IDocumentBlock {
    id: string
    type: TextTypes,
    order?: TitleOrder,
    leaf?: boolean,
    autoFocus?: boolean,
    created?: boolean,

    textNodes?: ITextNode[]
}

interface IDocumentMenuItem {
    id: string,
    type: TextTypes,
    icon: JSX.Element,
    name: string,
    searchId: string,

    config: IDocumentBlock
}

export type { 
    IDocument,
    IDocumentBlock,
    IDocumentPage,
    IDocumentMenuItem 
}