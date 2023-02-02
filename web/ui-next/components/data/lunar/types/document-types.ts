import { TitleOrder } from "@mantine/core/lib/Title"
import { IPresentationChart, ITextNode } from "../../../lunar/document-editor/blocks/types"

interface IDocument {
    /**
     * @description
     *  theese are the pages within the document.
     *  TODO: implement automatic page breaks.
     */
    pages: IDocumentPage[],

    /**
     * @deprecated
     */
    document_id: string,

    /**
     * @description
     *  contains central data for the document so expensive items dont have to be reused.
     *  E.X images, etc...
     */
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
    width?: number,
    height?: number,
    chartId?: string,
    chartData?: IChartBlockData
}

interface IChartBlockData {
    presentationData: IPresentationChart,
    title: string,
    caption: string
}

interface IActionMenuItem {
    icon: JSX.Element,
    label: string,
    cb: () => void
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
    IDocumentData,
    IActionMenuItem, 
    IChartBlockData
}