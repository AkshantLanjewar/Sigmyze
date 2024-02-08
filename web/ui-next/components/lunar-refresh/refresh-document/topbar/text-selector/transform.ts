import { Blocks, INoteBlock } from "../../types";

/*
 * These are all the types that can be classified as a heading
 */
const HeadingValues: Blocks[] = [
    "heading::6",
    "heading::5",
    "heading::4",
    "heading::3",
    "heading::2",
    "heading::1"
]

/*
 * These are all the types that can be classified as text
 */
const TextValues: Blocks[] = [
    ...HeadingValues,
    "paragraph"
]

/*
 * These are all the types that can be classified as a media block
 */
const MediaValues: Blocks[] = [
    "media::image",
    "media::chart"
]

/**
 * @description
 *  - this is the function that handles the case of converting a paragraph to a heading
 * @param block
 *  - this is the block we are going to transform
 * @param desiredType
 *  - this is the desired type of the new block
 */
const paragraphToHeading = (block: INoteBlock, desiredType: Blocks) => {
    if(block.blockType !== "paragraph" || HeadingValues.includes(desiredType) === false)
        return
    
    let newBlock = { ...block }
    let ticks = "#"
    switch(desiredType) {
        case "heading::1":
            ticks = "#"
            break
        case "heading::2":
            ticks = "##"
            break
        case "heading::3":
            ticks = "###"
            break
        case "heading::4":
            ticks = "####"
            break
        case "heading::5":
            ticks = "#####"
            break
        case "heading::6":
            ticks = "######"
            break
        default:
            return
    }
    
    if(block.blockContent.length > 0)
        newBlock.blockContent = `${ticks} ${block.blockContent}`
    else
        newBlock.blockContent = ticks

    newBlock.blockType = desiredType
    return newBlock
}

/*
 * @description
 *  - this is the functoin that handles converting a heading to a paragraph block 
 * @param block 
 *  - this is the block we are going to transform 
 * @param desiredType
 *  - this is the new type for the block
 */
const headingToParagraph = (block: INoteBlock, desiredType: Blocks) => {
    if(HeadingValues.includes(block.blockType) === false || desiredType !== "paragraph")
        return

    let contentSplit = block.blockContent.split(" ")
    let newContent = ""
    for(let i = 1; i < contentSplit.length; i++)
        newContent += contentSplit[i]

    let newBlock = { ...block }
    newBlock.blockType = "paragraph"
    newBlock.blockContent = newContent

    return newBlock
}

/*
 * @description
 *  - This is the function that handles converting a text block to a media block
 * @param block
 *  - this is the block we are going to transform
 * @param desiredType
 *  - this is the new type for the block
 */
const textToMedia = (block: INoteBlock, desiredType: Blocks) => {
    if(TextValues.includes(block.blockType) === false || MediaValues.includes(desiredType) === false)
        return

    let newBlock = { ...block }
    newBlock.blockType = desiredType
    newBlock.blockContent = ""

    return newBlock
}

/*
 * @description
 *  - This is the function that handles converting a media block to a paragraph
 * @param block
 *  - this is the block we are going to transform
 * @param desiredType
 *  - this is the new type for the block
 */
const mediaToParagraph = (block: INoteBlock, desiredType: Blocks) => {
    if(MediaValues.includes(block.blockType) === false || desiredType !== "paragraph")
        return

    let newBlock = { ...block }
    newBlock.blockType = desiredType
    newBlock.blockContent = ""

    return newBlock
}

/*
 * @description
 *  - This is the function that handles the conversion from media to heading
 * @param block
 *  - this is the block we are going to transform
 * @param desiredType
 *  - this is the new type for the block
 */
const mediaToHeading = (block: INoteBlock, desiredType: Blocks) => {
    if(MediaValues.includes(block.blockType) === false || HeadingValues.includes(desiredType) === false)
        return

    let newBlock = { ...block }
    newBlock.blockType = desiredType
    switch(desiredType) {
        case "heading::1":
            newBlock.blockContent = "#"
            break
        case "heading::2":
            newBlock.blockContent = "##"
            break
        case "heading::3":
            newBlock.blockContent = "###"
            break
        case "heading::4":
            newBlock.blockContent = "####"
            break
        case "heading::5":
            newBlock.blockContent = "#####"
            break
        case "heading::6":
            newBlock.blockContent = "######"
            break
        default:
            return
    }

    return newBlock
}

export { 
    HeadingValues,
    TextValues,
    MediaValues,
    paragraphToHeading,
    headingToParagraph,
    textToMedia,
    mediaToParagraph,
    mediaToHeading
}
