import { TitleOrder } from "@mantine/core/lib/Title"
import { ITextNode } from "../../lunar/document-editor/blocks/types"

interface IDocument {
    pages: IDocumentPage[],
    document_id: string,
    data?: IDocumentData
}

interface IDocumentData {
    image_store?: { [key: string]: string }
}

interface IDocumentPage {
    blocks: IDocumentBlock[]
}

type TextTypes = "title" | "paragraph"
type MediaTypes = "image" | "chart"

interface IDocumentBlock {
    id: string
    type: TextTypes | MediaTypes,
    order?: TitleOrder,
    leaf?: boolean,
    autoFocus?: boolean,
    created?: boolean,

    textNodes?: ITextNode[],
    imageData?: string,
    width?: string | number,
    height?: number
}

interface IDocumentMenuItem {
    id: string,
    type: TextTypes | MediaTypes,
    icon: JSX.Element,
    name: string,
    searchId: string,

    config: IDocumentBlock
}

export type { 
    IDocument,
    IDocumentBlock,
    IDocumentPage,
    IDocumentMenuItem,
    TextTypes,
    MediaTypes,
    IDocumentData 
}