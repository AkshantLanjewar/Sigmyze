/**
 * these are all the possible type of text blocks
 */
type TextBlocks = "paragraph" | "heading::1" | "heading::2" | "heading::3" | "heading::4" | "heading::5" | "heading::6"

/**
 * These are all the possible types of media blocks
 */
type MediaBlocks = "media::image" | "media::chart"

/**
 * These are all the system blocks
 */
type SystemBlocks = "system::group"

/**
 * These are all the block types
 */
type Blocks = TextBlocks | MediaBlocks | SystemBlocks

/*
 * This is the interface that defines the styles within the note block editor
 */
interface IBlockStyles {
    /*
     * Whether or not the current block is bolded
     */
    bold: boolean,

    /*
     * Whether or not the current block is italicized
     */
    italic: boolean,

    /*
     * Whether or not the current block has strikethru activated
     */
    strikethru: boolean,

    /*
     * The alignment for the block
     * NOTE: the default alignment for text based blocks is left
     * NOTE: the default alignment for media based blocks is center
     */
    align: 'left' | 'center' | 'right' | 'justified'
}

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
    blockType: Blocks,

    /**
     * This is the content of the block. Stored in string form so changes can be easily detected.
     */
    blockContent: string,

    /**
     * Whether or not this block is grouped
     */
    isGroup: boolean

    /**
     * If the block has children, this is where it would be stored
     */
    blockChildren?: INoteBlock[],
    
    /*
     * This is where the blocks styles are stored
     */
    blockStyles?: IBlockStyles
}



export type { 
    INoteBlock,
    TextBlocks,
    MediaBlocks,
    SystemBlocks,
    Blocks, 
    IBlockStyles
}
