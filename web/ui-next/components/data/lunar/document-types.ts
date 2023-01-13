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
    type: TextTypes,
    order?: number,
    leaf?: boolean,

    textNodes?: ITextNode
}

export type { 
    IDocument,
    IDocumentBlock,
    IDocumentPage 
}