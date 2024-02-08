import NoteTopbar from "./topbar"
import BlockRenderer from "./block-renderer"
import useNoteData from "./hooks/note-data" 
import { useContext, useEffect, useRef } from "react"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"
import { LunarDataManagerData } from "../data-manager"
import { ILunarDataManagerState } from "../data-manager/state"
import useNoteFocus from "./hooks/note-focus"

interface IRefreshDocumentProps {
    /**
     * This is the FileID used to retreive data from the data context
     */
    fileId: string
}

const RefreshDocument: React.FC<IRefreshDocumentProps> = ({ fileId }) => {
    const { getFileById, editFileTitle } = useContext(LunarUIContextData) as ILunarUIState
    const { fetchNoteBlocks, updateNoteBlocks } = useContext(LunarDataManagerData) as ILunarDataManagerState

    const { hasRequest, activeBlock, consumeFocusRequest, createFocusRequest, setActiveBlockState } = useNoteFocus()

    const {
        blocks,
        title,
        blocksUpdated,
        stylesUpdated,
        blocksSTR,
        changeNoteTitle,
        updateNoteBlock,
        changeNoteBlock,
        createRawBlock,
        deleteNoteBlock,
        groupNoteBlock,
        ungroupNoteBlock,
        appendNoteBlock,
        incrementFocusUp,
        decrementFocusDown,
        getBlockStyles,
        setBlockStyles
    } = useNoteData(fileId, activeBlock, getFileById, editFileTitle, fetchNoteBlocks, updateNoteBlocks, createFocusRequest)

    //this is the ref that handles the initial load
    const initialLoad = useRef<boolean>(true)

    useEffect(() => {
        if(initialLoad.current === false || blocks.length === 0)
            return

        let rootBlock = blocks[0]
        createFocusRequest(rootBlock.blockId)
        initialLoad.current = false
    }, [blocks])

    return (
        <div
            style={{
                height: "100%", 
                width: "100%",
                background: "#101113",
                display: "block",
                position: 'relative',
                marginBottom: "5em"
            }}
        >
            <NoteTopbar
                blocks={blocks}
                stylesUpdated={stylesUpdated}
                activeBlock={activeBlock}
                changeNoteBlock={changeNoteBlock}
                getBlockStyles={getBlockStyles}
                setBlockStyles={setBlockStyles}
            />

            <BlockRenderer
                blocks={blocks}
                title={title}
                hasRequest={hasRequest}
                blocksUpdated={blocksUpdated}
                blocksSTR={blocksSTR}
                activeBlock={activeBlock}
                editNoteName={changeNoteTitle}
                updateNoteBlock={updateNoteBlock}
                consumeFocusRequest={consumeFocusRequest}
                changeNoteBlock={changeNoteBlock}
                createRawBlock={createRawBlock}
                deleteNoteBlock={deleteNoteBlock}
                createFocusRequest={createFocusRequest}
                groupNoteBlock={groupNoteBlock}
                appendNoteBlock={appendNoteBlock}
                ungroupNoteBlock={ungroupNoteBlock}
                setActiveBlockState={setActiveBlockState}
                incrementFocusUp={incrementFocusUp}
                decrementFocusDown={decrementFocusDown}
                getBlockStyles={getBlockStyles}
            />
        </div>
    )
}

export default RefreshDocument
