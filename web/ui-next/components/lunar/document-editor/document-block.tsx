import { useEffect, useState } from "react"
import { IDocumentBlock, IDocumentMenuItem } from '../../data/lunar/document-types'
import TextBlock from "./blocks/text-block"
import { 
    createBlock, 
    deleteBlock, 
    inputActiveState, 
    inputValueState, 
    menuPosState, 
    oldInput, 
    setLastActive, 
    updateBlock,
    closeMenuState, 
    inputIdState
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
    menuPosState: menuPosState,
    closeMenuState: closeMenuState,
    inputIdState: inputIdState,

    leafMenuUpdate: boolean,
    leafMenuItem: IDocumentMenuItem | null,
    moveFocus: (id: string, direction: "up" | "down") => void
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
    menuPosState,
    closeMenuState,
    inputIdState,
    leafMenuItem,
    leafMenuUpdate,
    moveFocus 
}) => {
    const [internalBlock, setInternalBlock] = useState<IDocumentBlock | null>(null)
    
    useEffect(() => {
        if(leaf === true)
            setInternalBlock(LEAF_BLOCK)
    }, [])

    useEffect(() => {
        if(leafMenuItem === null)
            return
        if(internalBlock === null)
            return
        if(leaf === false)
            return

        let nBlock = leafMenuItem.config
        nBlock.id = internalBlock.id
        nBlock.textNodes = internalBlock.textNodes
        nBlock.leaf = true
        setInternalBlock({ ...nBlock })
    }, [leafMenuUpdate])

    useEffect(() => {
        if(block === undefined)
            return
        if(leaf === true)
            return

        setInternalBlock({ ...block })
    }, [block, block?.type, block?.order])

    //helper functions
    function resetInternalBlock() {
        setInternalBlock(LEAF_BLOCK)
    }

    return (
        <div>
            {(internalBlock?.type === "paragraph" || internalBlock?.type === "title") && (
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
                    closeMenuState={closeMenuState}
                    inputIdState={inputIdState}
                    resetInternalBlock={resetInternalBlock}
                    moveFocus={moveFocus}
                />
            )}
        </div>
    )
}

export default DocumentBlock