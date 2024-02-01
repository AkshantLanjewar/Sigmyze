import { IconCamera, IconChartHistogram, IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconTextCaption } from "@tabler/icons"
import { Blocks } from "../../types"

interface IRegisteredNoteBlock {
    /**
     * This is the type for the block
     */
    blockType: Blocks,

    /**
     * This is the name of the block
     */
    name: string,

    /**
     * This is the description of the block
     */
    description: string
}


/**
 * This is the registry of all rendered blocks within the note editor
 */
const BLOCK_REGSITRY: IRegisteredNoteBlock[] = [
    {
        blockType: "paragraph",
        name: "Paragraph",
        description: "Default block type. Good for drafting text etc..."
    },
    {
        blockType: "heading::1",
        name: "Heading 1",
        description: "Largest Heading size, good for titles etc..."
    },
    {
        blockType: "heading::2",
        name: "Heading 2",
        description: "Second largest Heading size, good for subtitles etc..."
    },
    {
        blockType: "heading::3",
        name: "Heading 3",
        description: "Third largest Heading size, good for subsections etc..."
    },
    {
        blockType: "heading::4",
        name: "Heading 4",
        description: "Fourth largest Heading size, good for outlining ideas etc..."
    },
    {
        blockType: "heading::5",
        name: "Heading 5",
        description: "Fifth largest Heading size, used for minor importance etc..."
    },
    {
        blockType: "heading::6",
        name: "Heading 6",
        description: "Sixth largest Heading size, used for emphasiszing minor sections etc..."
    },
    {
        blockType: "media::chart",
        name: "Lunar Chart",
        description: "Add a Lunar data visualization into your document!"
    },
    {
        blockType: "media::image",
        name: "Image",
        description: "Add an image into your document!"
    }
]

interface IRegistryIconProps {
    /**
     * This is the block that we want the icon for
     */
    block: Blocks
}

const RegistryIcon: React.FC<IRegistryIconProps> = ({ block }) => {
    switch(block) {
        case "paragraph":
            return <IconTextCaption size={22} />
        case "heading::1":
            return <IconH1 size={22} />
        case "heading::2":
            return <IconH2 size={22} />
        case "heading::3":
            return <IconH3 size={22} />
        case "heading::4":
            return <IconH4 size={22} />
        case "heading::5":
            return <IconH5 size={22} />
        case "heading::6":
            return <IconH6 size={22} />
        case "media::chart":
            return <IconChartHistogram size={22} />
        case "media::image":
            return <IconCamera size={22} />
        default:
            return null
    }

    return null
}

export type { IRegisteredNoteBlock }
export { BLOCK_REGSITRY, RegistryIcon }