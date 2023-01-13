import { useEffect, useState } from "react"
import { IDocumentBlock } from '../../data/lunar/document-types'
import TextBlock from "./blocks/text-block"

interface IDocumentBlockProps {
    leaf?: boolean
}

const LEAF_BLOCK = {
    type: "paragraph",
    leaf: true
} as IDocumentBlock

const DocumentBlock: React.FC<IDocumentBlockProps> = ({ leaf }) => {
    const [internalBlock, setInternalBlock] = useState<IDocumentBlock | null>(null)
    
    useEffect(() => {
        if(leaf === true)
            setInternalBlock(LEAF_BLOCK)
    }, [])

    return (
        <div>
            {internalBlock?.type === "paragraph" && (
                <TextBlock
                    block={internalBlock}
                />
            )}
        </div>
    )
}

export default DocumentBlock