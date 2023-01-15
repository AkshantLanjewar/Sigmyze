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
    order?: number,
    leaf?: boolean,
    autoFocus?: boolean,

    textNodes?: ITextNode[]
}

export type { 
    IDocument,
    IDocumentBlock,
    IDocumentPage 
}