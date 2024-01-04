/**
 * these are all the possible type of text blocks
 */
type TextBlocks = "paragraph" | "heading::1" | "heading::2" | "heading::3" | "heading::4" | "heading::5" | "heading::6"

/**
 * These are all the possible types of media blocks
 */
type MediaBlocks = "media::image" | "media::chart"

/**
 * This is the datastructure definition for a block within a note in the refresh note editor
 */
interface INoteBlock {
    /**
     * This is the unique ID of the block
     */
    blockId: string,

    /**
     * This is the type the block can be. It is the union of all possible block types within the editor
     */
    blockType: TextBlocks | MediaBlocks,

    /**
     * This is the content of the block. Stored in string form so changes can be easily detected.
     */
    blockContent: string
}

export type { 
    INoteBlock,
    TextBlocks,
    MediaBlocks 
}