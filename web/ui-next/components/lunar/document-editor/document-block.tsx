import { useEffect, useState } from "react"
import { IDocumentBlock } from '../../data/lunar/document-types'
import TextBlock from "./blocks/text-block"
import { 
    createBlock, 
    deleteBlock, 
    inputActiveState, 
    inputValueState, 
    menuPosState, 
    oldInput, 
    setLastActive, 
    updateBlock 
} from "./document-editor"

interface IDocumentBlockProps {
    leaf?: boolean,
    createBlock?: createBlock,
    updateBlock?: updateBlock,
    deleteBlock?: deleteBlock,
    setLastActive?: setLastActive,
    block?: IDocumentBlock,
    autoFocus?: boolean,
    index: number,
    oldInput: oldInput,
    inputActive: inputActiveState,
    inputValue: inputValueState,
    menuPosState: menuPosState
}

const LEAF_BLOCK = {
    type: "paragraph",
    leaf: true,
    id: "leaf-block"
} as IDocumentBlock

const DocumentBlock: React.FC<IDocumentBlockProps> = 
({ 
    leaf, 
    createBlock, 
    updateBlock, 
    block, 
    index, 
    autoFocus, 
    deleteBlock, 
    setLastActive, 
    oldInput, 
    inputActive, 
    inputValue,
    menuPosState 
}) => {
    const [internalBlock, setInternalBlock] = useState<IDocumentBlock | null>(null)
    
    useEffect(() => {
        if(leaf === true)
            setInternalBlock(LEAF_BLOCK)
    }, [])

    useEffect(() => {
        if(block === undefined)
            return
        if(leaf === true)
            return

        setInternalBlock({ ...block })
    }, [block])

    return (
        <div>
            {internalBlock?.type === "paragraph" && (
                <TextBlock
                    block={internalBlock}
                    index={index}
                    createBlock={createBlock}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                    setLastActive={setLastActive}
                    autoFocus={autoFocus}
                    oldInput={oldInput}
                    inputActiveState={inputActive}
                    inputValueState={inputValue}
                    menuPosState={menuPosState}
                />
            )}
        </div>
    )
}

export default DocumentBlock